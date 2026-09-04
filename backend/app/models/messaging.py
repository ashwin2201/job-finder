from datetime import datetime, timezone
from uuid import UUID, uuid4

from sqlalchemy import Column, DateTime
from sqlmodel import Field, SQLModel


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Conversation(SQLModel, table=True):
    __tablename__ = "conversations"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    kind: str = Field(default="direct", max_length=32, index=True)
    direct_key: str | None = Field(
        default=None,
        max_length=73,
        unique=True,
        index=True,
    )
    subject: str | None = Field(default=None, max_length=200)
    created_by_id: UUID = Field(
        foreign_key="users.id",
        nullable=False,
        ondelete="RESTRICT",
    )
    created_at: datetime = Field(
        default_factory=utc_now,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
    updated_at: datetime = Field(
        default_factory=utc_now,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )


class ConversationParticipant(SQLModel, table=True):
    __tablename__ = "conversation_participants"

    conversation_id: UUID = Field(
        primary_key=True,
        foreign_key="conversations.id",
        ondelete="CASCADE",
    )
    user_id: UUID = Field(
        primary_key=True,
        foreign_key="users.id",
        index=True,
        ondelete="CASCADE",
    )
    joined_at: datetime = Field(
        default_factory=utc_now,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
    last_read_at: datetime | None = Field(
        default=None,
        sa_column=Column(DateTime(timezone=True), nullable=True),
    )
    left_at: datetime | None = Field(
        default=None,
        sa_column=Column(DateTime(timezone=True), nullable=True),
    )


class Message(SQLModel, table=True):
    __tablename__ = "messages"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    conversation_id: UUID = Field(
        foreign_key="conversations.id",
        nullable=False,
        index=True,
        ondelete="CASCADE",
    )
    sender_id: UUID = Field(
        foreign_key="users.id",
        nullable=False,
        index=True,
        ondelete="RESTRICT",
    )
    body: str = Field()
    created_at: datetime = Field(
        default_factory=utc_now,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
    edited_at: datetime | None = Field(
        default=None,
        sa_column=Column(DateTime(timezone=True), nullable=True),
    )
    deleted_at: datetime | None = Field(
        default=None,
        sa_column=Column(DateTime(timezone=True), nullable=True),
    )
