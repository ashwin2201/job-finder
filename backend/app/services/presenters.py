from models.company import Company
from models.job import Job
from schemas.job import JobRead


def job_read(job: Job, company: Company) -> JobRead:
    return JobRead(
        id=job.id,
        company_id=job.company_id,
        title=job.title,
        company_name=company.name,
        status=job.status,
        published_at=job.published_at,
        location=job.location,
        description=job.description,
    )
