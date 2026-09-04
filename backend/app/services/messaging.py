from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, func, select

from models.identity import User
from models.messaging import Conversation, ConversationParticipant, Message
from schemas.messaging import (
    ConversationParticipantRead,
    ConversationRead,
    MessageRead,
)


def _direct_key(first_user_id: UUID, second_user_id: UUID) -> str:
    return ":".join(sorted((str(first_user_id), str(second_user_id))))


def _message_read(message: Message) -> MessageRead:
    return MessageRead(
        id=message.id,
        conversation_id=message.conversation_id,
        sender_id=message.sender_id,
        body=message.body,
        created_at=message.created_at,
        edited_at=message.edited_at,
    )


def _active_participant(
    session: Session,
    conversation_id: UUID,
    user_id: UUID,
) -> ConversationParticipant:
    participant = session.exec(
        select(ConversationParticipant).where(
            ConversationParticipant.conversation_id == conversation_id,
            ConversationParticipant.user_id == user_id,
            ConversationParticipant.left_at.is_(None),
        )
    ).first()
    if participant is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return participant


def _conversation_read(
    session: Session,
    conversation: Conversation,
    current_user_id: UUID,
) -> ConversationRead:
    participant_rows = session.exec(
        select(ConversationParticipant, User)
        .join(User, ConversationParticipant.user_id == User.id)
        .where(
            ConversationParticipant.conversation_id == conversation.id,
            ConversationParticipant.left_at.is_(None),
        )
        .order_by(User.display_name)
    ).all()
    current_participant = next(
        (
            participant
            for participant, _ in participant_rows
            if participant.user_id == current_user_id
        ),
        None,
    )
    if current_participant is None:
        raise HTTPException(status_code=404, detail="Conversation not found")

    last_message = session.exec(
        select(Message)
        .where(
            Message.conversation_id == conversation.id,
            Message.deleted_at.is_(None),
        )
        .order_by(Message.created_at.desc(), Message.id.desc())
    ).first()

    unread_statement = select(func.count(Message.id)).where(
        Message.conversation_id == conversation.id,
        Message.sender_id != current_user_id,
        Message.deleted_at.is_(None),
    )
    if current_participant.last_read_at is not None:
        unread_statement = unread_statement.where(
            Message.created_at > current_participant.last_read_at
        )
    unread_count = session.exec(unread_statement).one()

    return ConversationRead(
        id=conversation.id,
        kind=conversation.kind,
        subject=conversation.subject,
        participants=[
            ConversationParticipantRead(
                user_id=user.id,
                display_name=user.display_name,
            )
            for _, user in participant_rows
        ],
        last_message=_message_read(last_message) if last_message else None,
        unread_count=unread_count,
        created_at=conversation.created_at,
        updated_at=conversation.updated_at,
    )


def create_direct_conversation(
    session: Session,
    current_user: User,
    participant_id: UUID,
) -> ConversationRead:
    if participant_id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot start a conversation with yourself",
        )
    participant_user = session.get(User, participant_id)
    if participant_user is None or participant_user.account_status != "active":
        raise HTTPException(status_code=404, detail="User not found")

    direct_key = _direct_key(current_user.id, participant_id)
    existing = session.exec(
        select(Conversation).where(Conversation.direct_key == direct_key)
    ).first()
    if existing is not None:
        return _conversation_read(session, existing, current_user.id)

    now = datetime.now(timezone.utc)
    conversation = Conversation(
        kind="direct",
        direct_key=direct_key,
        created_by_id=current_user.id,
        created_at=now,
        updated_at=now,
    )
    session.add(conversation)
    session.flush()
    session.add(
        ConversationParticipant(
            conversation_id=conversation.id,
            user_id=current_user.id,
            joined_at=now,
            last_read_at=now,
        )
    )
    session.add(
        ConversationParticipant(
            conversation_id=conversation.id,
            user_id=participant_id,
            joined_at=now,
        )
    )
    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        existing = session.exec(
            select(Conversation).where(Conversation.direct_key == direct_key)
        ).first()
        if existing is None:
            raise
        conversation = existing
    return _conversation_read(session, conversation, current_user.id)


def list_conversations(
    session: Session,
    current_user_id: UUID,
) -> list[ConversationRead]:
    statement = (
        select(Conversation)
        .join(
            ConversationParticipant,
            ConversationParticipant.conversation_id == Conversation.id,
        )
        .where(
            ConversationParticipant.user_id == current_user_id,
            ConversationParticipant.left_at.is_(None),
        )
        .order_by(Conversation.updated_at.desc())
    )
    return [
        _conversation_read(session, conversation, current_user_id)
        for conversation in session.exec(statement).all()
    ]


def list_messages(
    session: Session,
    conversation_id: UUID,
    current_user_id: UUID,
    *,
    before: datetime | None,
    limit: int,
) -> list[MessageRead]:
    _active_participant(session, conversation_id, current_user_id)
    statement = (
        select(Message)
        .where(
            Message.conversation_id == conversation_id,
            Message.deleted_at.is_(None),
        )
        .order_by(Message.created_at.desc(), Message.id.desc())
        .limit(limit)
    )
    if before is not None:
        statement = statement.where(Message.created_at < before)
    messages = list(reversed(session.exec(statement).all()))
    return [_message_read(message) for message in messages]


def send_message(
    session: Session,
    conversation_id: UUID,
    sender_id: UUID,
    body: str,
) -> MessageRead:
    participant = _active_participant(session, conversation_id, sender_id)
    conversation = session.get(Conversation, conversation_id)
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")

    now = datetime.now(timezone.utc)
    message = Message(
        conversation_id=conversation_id,
        sender_id=sender_id,
        body=body,
        created_at=now,
    )
    participant.last_read_at = now
    conversation.updated_at = now
    session.add(message)
    session.add(participant)
    session.add(conversation)
    session.commit()
    session.refresh(message)
    return _message_read(message)


def mark_conversation_read(
    session: Session,
    conversation_id: UUID,
    user_id: UUID,
) -> None:
    participant = _active_participant(session, conversation_id, user_id)
    participant.last_read_at = datetime.now(timezone.utc)
    session.add(participant)
    session.commit()
