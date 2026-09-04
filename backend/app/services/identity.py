from typing import Any
from uuid import UUID

from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

from models.company import CompanyMembership
from models.identity import AuthIdentity, User, UserProfile
from schemas.identity import UserCompanyRead, UserProfileUpdate, UserUpdate


def get_user_details(session: Session, user_id: UUID) -> User | None:
    statement = (
        select(User)
        .where(User.id == user_id)
        .options(
            selectinload(User.profile),
            selectinload(User.auth_identities),
        )
    )
    return session.exec(statement).first()


def update_user(session: Session, user: User, data: UserUpdate) -> User:
    user.display_name = data.display_name
    session.add(user)
    session.commit()
    return get_user_details(session, user.id) or user


def update_user_profile(
    session: Session,
    user: User,
    data: UserProfileUpdate,
) -> UserProfile:
    profile = session.get(UserProfile, user.id)
    if profile is None:
        profile = UserProfile(user_id=user.id)

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)

    session.add(profile)
    session.commit()
    session.refresh(profile)
    return profile


def list_user_companies(session: Session, user_id: UUID) -> list[UserCompanyRead]:
    statement = (
        select(CompanyMembership)
        .where(CompanyMembership.user_id == user_id)
        .options(selectinload(CompanyMembership.company))
    )
    memberships = session.exec(statement).all()
    return [
        UserCompanyRead(
            company_id=membership.company_id,
            name=membership.company.name,
            slug=membership.company.slug,
            role=membership.role,
            status=membership.status,
        )
        for membership in memberships
        if membership.company.status == "active"
    ]


def deactivate_user(session: Session, user: User) -> None:
    user.account_status = "deactivated"
    session.add(user)
    session.commit()


def _primary_email(data: dict[str, Any]) -> str:
    addresses = data.get("email_addresses") or []
    primary_id = data.get("primary_email_address_id")
    primary = next(
        (entry for entry in addresses if entry.get("id") == primary_id),
        addresses[0] if addresses else {},
    )
    return primary.get("email_address") or ""


def _display_name(data: dict[str, Any], email: str) -> str:
    full_name = " ".join(
        part for part in (data.get("first_name"), data.get("last_name")) if part
    )
    return full_name or data.get("username") or email.split("@", 1)[0] or "User"


def sync_clerk_user(session: Session, event_type: str, data: dict[str, Any]) -> None:
    provider_subject = data.get("id")
    if not provider_subject:
        return

    statement = select(AuthIdentity).where(
        AuthIdentity.provider == "clerk",
        AuthIdentity.provider_subject == provider_subject,
    )
    identity = session.exec(statement).first()

    if event_type == "user.deleted":
        if identity is not None:
            user = session.get(User, identity.user_id)
            if user is not None:
                user.account_status = "deactivated"
                session.add(user)
                session.commit()
        return

    if event_type not in {"user.created", "user.updated"}:
        return

    email = _primary_email(data)
    display_name = _display_name(data, email)
    if identity is None:
        user = User(display_name=display_name)
        user.profile = UserProfile()
        identity = AuthIdentity(
            provider="clerk",
            provider_subject=provider_subject,
            email=email,
        )
        user.auth_identities.append(identity)
        session.add(user)
    else:
        user = session.get(User, identity.user_id)
        if user is None:
            return
        user.display_name = display_name
        user.account_status = "active"
        identity.email = email
        session.add(user)
        session.add(identity)
    session.commit()
