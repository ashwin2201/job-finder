from sqlmodel import Field, SQLModel

class Job(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    company: str
    location: str
    description: str
    salary: str | None = None
    created_at: str | None = None
    updated_at: str | None = None
