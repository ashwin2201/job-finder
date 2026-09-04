from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class JobRead(BaseModel):
    id: UUID
    company_id: UUID
    title: str
    company: str = Field(validation_alias="company_name")
    status: str
    published_at: datetime | None
    location: str
    description: str

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class JobPage(BaseModel):
    items: list[JobRead]
    page: int
    page_size: int
    total: int
    total_pages: int
