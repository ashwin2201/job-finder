from datetime import datetime
from typing import TYPE_CHECKING, Optional
from uuid import UUID, uuid4

from sqlalchemy import Column, DateTime
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from models.company import Company


class Job(SQLModel, table=True):
    __tablename__ = "jobs"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    company_id: UUID = Field(
        foreign_key="companies.id",
        nullable=False,
        index=True,
        ondelete="RESTRICT",
    )
    title: str = Field(max_length=200, index=True)
    status: str = Field(default="draft", max_length=32, index=True)
    published_at: Optional[datetime] = Field(
        default=None,
        sa_column=Column(DateTime(timezone=True), nullable=True),
    )
    location: str = Field(default="", max_length=200)
    description: str = Field(default="")

    company: "Company" = Relationship(back_populates="jobs")

    @property
    def company_name(self) -> str:
        return self.company.name
