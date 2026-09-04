from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class ConversationCreate(BaseModel):
    participant_id: UUID


class ConversationParticipantRead(BaseModel):
    user_id: UUID
    display_name: str


class MessageCreate(BaseModel):
    body: str = Field(min_length=1, max_length=4_000)

    model_config = {"str_strip_whitespace": True}


class MessageRead(BaseModel):
    id: UUID
    conversation_id: UUID
    sender_id: UUID
    body: str
    created_at: datetime
    edited_at: datetime | None


class ConversationRead(BaseModel):
    id: UUID
    kind: str
    subject: str | None
    participants: list[ConversationParticipantRead]
    last_message: MessageRead | None
    unread_count: int
    created_at: datetime
    updated_at: datetime
