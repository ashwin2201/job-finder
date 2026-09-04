import json

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Session

from core.auth import verify_clerk_webhook
from core.database import get_session
from services.identity import sync_clerk_user


router = APIRouter(prefix="/api/webhooks")


@router.post("/clerk")
async def clerk_webhook(
    request: Request,
    session: Session = Depends(get_session),
):
    payload = await request.body()
    verify_clerk_webhook(request, payload)
    try:
        event = json.loads(payload)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=400, detail="Invalid webhook payload") from exc

    sync_clerk_user(
        session,
        event_type=event.get("type", ""),
        data=event.get("data") or {},
    )
    return {"received": True}
