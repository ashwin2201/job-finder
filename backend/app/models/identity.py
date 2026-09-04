from datetime import datetime, timezone
from typing import TYPE_CHECKING, Optional
from uuid import UUID, uuid4

from sqlalchemy import Column, DateTime, UniqueConstraint
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from models.company import CompanyMembership


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    display_name: str = Field(max_length=120)
    account_status: str = Field(default="active", max_length=32, index=True)
    created_at: datetime = Field(
        default_factory=utc_now,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )

    auth_identities: list["AuthIdentity"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )
    profile: Optional["UserProfile"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={
            "cascade": "all, delete-orphan",
            "single_parent": True,
            "uselist": False,
        },
    )
    company_memberships: list["CompanyMembership"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )


class AuthIdentity(SQLModel, table=True):
    __tablename__ = "auth_identities"
    __table_args__ = (
        UniqueConstraint(
            "provider",
            "provider_subject",
            name="uq_auth_identities_provider_subject",
        ),
    )

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(
        foreign_key="users.id",
        nullable=False,
        index=True,
        ondelete="CASCADE",
    )
    provider: str = Field(max_length=50)
    provider_subject: str = Field(max_length=255)
    email: str = Field(max_length=320, index=True)

    user: "User" = Relationship(back_populates="auth_identities")


class UserProfile(SQLModel, table=True):
    __tablename__ = "user_profiles"

    user_id: UUID = Field(
        primary_key=True,
        foreign_key="users.id",
        ondelete="CASCADE",
    )
    headline: Optional[str] = Field(default=None, max_length=200)
    bio: Optional[str] = Field(default=None)
    location: Optional[str] = Field(default=None, max_length=120)
    visibility: str = Field(default="public", max_length=32, index=True)

    user: "User" = Relationship(back_populates="profile")
