from datetime import datetime
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, Response, status
from sqlmodel import Session

from core.auth import get_current_user
from core.database import get_session
from models.identity import User
from schemas.messaging import (
    ConversationCreate,
    ConversationRead,
    MessageCreate,
    MessageRead,
)
from services.messaging import (
    create_direct_conversation,
    list_conversations,
    list_messages,
    mark_conversation_read,
    send_message,
)


router = APIRouter(prefix="/api/conversations")


@router.get("", response_model=list[ConversationRead])
def read_conversations(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return list_conversations(session, current_user.id)


@router.post(
    "",
    response_model=ConversationRead,
    status_code=status.HTTP_201_CREATED,
)
def post_conversation(
    data: ConversationCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return create_direct_conversation(
        session,
        current_user,
        data.participant_id,
    )


@router.get("/{conversation_id}/messages", response_model=list[MessageRead])
def read_messages(
    conversation_id: UUID,
    before: datetime | None = Query(default=None),
    limit: Annotated[int, Query(ge=1, le=100)] = 50,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return list_messages(
        session,
        conversation_id,
        current_user.id,
        before=before,
        limit=limit,
    )


@router.post(
    "/{conversation_id}/messages",
    response_model=MessageRead,
    status_code=status.HTTP_201_CREATED,
)
def post_message(
    conversation_id: UUID,
    data: MessageCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return send_message(
        session,
        conversation_id,
        current_user.id,
        data.body,
    )


@router.post(
    "/{conversation_id}/read",
    status_code=status.HTTP_204_NO_CONTENT,
)
def read_conversation(
    conversation_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> Response:
    mark_conversation_read(session, conversation_id, current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
