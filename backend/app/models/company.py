from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from models.identity import User
    from models.job import Job

class Company(SQLModel, table=True):
    __tablename__ = "companies"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(max_length=200, index=True)
    slug: str = Field(max_length=200, unique=True, index=True)
    status: str = Field(default="active", max_length=32, index=True)
    verification_status: str = Field(
        default="unverified",
        max_length=32,
        index=True,
    )

    memberships: list["CompanyMembership"] = Relationship(
        back_populates="company",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )
    jobs: list["Job"] = Relationship(back_populates="company")


class CompanyMembership(SQLModel, table=True):
    __tablename__ = "company_memberships"

    company_id: UUID = Field(
        primary_key=True,
        foreign_key="companies.id",
        ondelete="CASCADE",
    )
    user_id: UUID = Field(
        primary_key=True,
        foreign_key="users.id",
        index=True,
        ondelete="CASCADE",
    )
    role: str = Field(default="member", max_length=32)
    status: str = Field(default="active", max_length=32, index=True)

    company: "Company" = Relationship(back_populates="memberships")
    user: "User" = Relationship(back_populates="company_memberships")
