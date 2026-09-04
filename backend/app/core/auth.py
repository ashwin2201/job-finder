import base64
import binascii
import hashlib
import hmac
import logging
import ssl
import time
from functools import lru_cache
from typing import Any, Callable
from uuid import UUID

import certifi
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

from core.config import settings
from core.database import get_session
from models.company import CompanyMembership
from models.identity import AuthIdentity, User


bearer_scheme = HTTPBearer(auto_error=False)
logger = logging.getLogger(__name__)


@lru_cache
def _jwks_client(jwks_url: str):
    try:
        import jwt
    except ImportError as exc:
        raise RuntimeError("PyJWT[crypto] must be installed") from exc
    ssl_context = ssl.create_default_context(cafile=certifi.where())
    return jwt.PyJWKClient(jwks_url, ssl_context=ssl_context)


def _decode_clerk_token(token: str) -> dict[str, Any]:
    try:
        import jwt
    except ImportError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication dependency is not installed",
        ) from exc

    if not settings.clerk_issuer:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="CLERK_ISSUER is not configured",
        )

    issuer = settings.clerk_issuer.rstrip("/")
    jwks_url = f"{issuer}/.well-known/jwks.json"
    validation_error: Exception | None = None

    try:
        signing_key = _jwks_client(jwks_url).get_signing_key_from_jwt(token)
        decode_options = {"verify_aud": settings.clerk_audience is not None}
        claims = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            issuer=issuer,
            audience=settings.clerk_audience,
            options=decode_options,
        )
    except jwt.ExpiredSignatureError as exc:
        detail = "Authentication token has expired"
        validation_error = exc
    except jwt.InvalidIssuerError as exc:
        detail = "Authentication token issuer does not match CLERK_ISSUER"
        validation_error = exc
    except jwt.InvalidAudienceError as exc:
        detail = "Authentication token audience does not match CLERK_AUDIENCE"
        validation_error = exc
    except jwt.ImmatureSignatureError as exc:
        detail = "Authentication token is not active yet; check the system clock"
        validation_error = exc
    except jwt.InvalidAlgorithmError as exc:
        detail = "Authentication token uses an unsupported signing algorithm"
        validation_error = exc
    except jwt.InvalidSignatureError as exc:
        detail = "Authentication token signature does not match Clerk's signing key"
        validation_error = exc
    except jwt.PyJWKClientConnectionError as exc:
        logger.warning("Unable to retrieve Clerk signing keys: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Unable to retrieve Clerk signing keys",
        ) from exc
    except jwt.PyJWKClientError as exc:
        detail = "Unable to select a Clerk signing key for this token"
        validation_error = exc
    except jwt.InvalidTokenError as exc:
        detail = "Authentication token is malformed or invalid"
        validation_error = exc
    except Exception as exc:
        logger.exception("Unexpected Clerk token validation failure")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc
    else:
        detail = None

    if detail is not None:
        logger.warning(
            "Clerk token validation failed (%s): %s",
            type(validation_error).__name__,
            validation_error,
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        ) from validation_error

    authorized_party = settings.clerk_authorized_party or settings.frontend_origin
    if claims.get("azp") and claims["azp"] != authorized_party:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token was issued to an unauthorized party",
        )
    return claims


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    session: Session = Depends(get_session),
) -> User:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Bearer token required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    claims = _decode_clerk_token(credentials.credentials)
    provider_subject = claims.get("sub")
    if not provider_subject:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token has no subject",
        )

    statement = (
        select(AuthIdentity)
        .where(
            AuthIdentity.provider == "clerk",
            AuthIdentity.provider_subject == provider_subject,
        )
        .options(selectinload(AuthIdentity.user))
    )
    identity = session.exec(statement).first()
    if identity is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account has not been provisioned",
        )
    if identity.user.account_status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is not active",
        )
    return identity.user


def require_company_roles(*allowed_roles: str) -> Callable[..., CompanyMembership]:
    def dependency(
        company_id: UUID,
        current_user: User = Depends(get_current_user),
        session: Session = Depends(get_session),
    ) -> CompanyMembership:
        statement = (
            select(CompanyMembership)
            .where(
                CompanyMembership.company_id == company_id,
                CompanyMembership.user_id == current_user.id,
                CompanyMembership.status == "active",
            )
            .options(selectinload(CompanyMembership.company))
        )
        membership = session.exec(statement).first()
        if (
            membership is None
            or membership.role not in allowed_roles
            or membership.company.status != "active"
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission for this company",
            )
        return membership

    return dependency


def verify_clerk_webhook(request: Request, payload: bytes) -> None:
    if settings.clerk_webhook_secret is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="CLERK_WEBHOOK_SECRET is not configured",
        )

    message_id = request.headers.get("svix-id")
    timestamp = request.headers.get("svix-timestamp")
    signature_header = request.headers.get("svix-signature")
    if not message_id or not timestamp or not signature_header:
        raise HTTPException(status_code=400, detail="Missing webhook signature headers")

    try:
        timestamp_value = int(timestamp)
    except (binascii.Error, ValueError) as exc:
        raise HTTPException(status_code=400, detail="Invalid webhook timestamp") from exc
    if abs(int(time.time()) - timestamp_value) > 300:
        raise HTTPException(status_code=400, detail="Webhook timestamp is too old")

    secret = settings.clerk_webhook_secret.get_secret_value()
    encoded_secret = secret.removeprefix("whsec_")
    try:
        secret_bytes = base64.b64decode(encoded_secret, validate=True)
    except ValueError as exc:
        raise HTTPException(status_code=500, detail="Invalid webhook secret") from exc

    signed_payload = f"{message_id}.{timestamp}.".encode() + payload
    expected = base64.b64encode(
        hmac.new(secret_bytes, signed_payload, hashlib.sha256).digest()
    ).decode()
    signatures = [
        value.split(",", 1)[1]
        for value in signature_header.split()
        if value.startswith("v1,")
    ]
    if not any(hmac.compare_digest(expected, signature) for signature in signatures):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")
