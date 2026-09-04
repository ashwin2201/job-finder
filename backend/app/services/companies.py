import hashlib
import re
from uuid import UUID

from sqlalchemy.orm import selectinload
from sqlmodel import Session, func, select

from models.company import Company, CompanyMembership
from models.identity import User


def company_slug(name: str) -> str:
    slug = re.sub(r"[^\w]+", "-", name.casefold()).strip("-")
    if slug:
        return slug
    digest = hashlib.sha256(name.encode("utf-8")).hexdigest()[:12]
    return f"company-{digest}"


def available_company_slug(session: Session, name: str) -> str:
    base_slug = company_slug(name)
    slug = base_slug
    suffix = 2
    while session.exec(select(Company.id).where(Company.slug == slug)).first():
        slug = f"{base_slug}-{suffix}"
        suffix += 1
    return slug


def create_company(session: Session, name: str, owner: User) -> Company:
    company = Company(name=name, slug=available_company_slug(session, name))
    company.memberships.append(
        CompanyMembership(user_id=owner.id, role="owner", status="active")
    )
    session.add(company)
    session.commit()
    session.refresh(company)
    return company


def get_company(session: Session, company_id: UUID) -> Company | None:
    return session.get(Company, company_id)


def update_company(session: Session, company: Company, name: str) -> Company:
    company.name = name
    session.add(company)
    session.commit()
    session.refresh(company)
    return company


def archive_company(session: Session, company: Company) -> None:
    company.status = "archived"
    for membership in company.memberships:
        membership.status = "suspended"
        session.add(membership)
    session.add(company)
    session.commit()


def list_company_members(
    session: Session,
    company_id: UUID,
) -> list[CompanyMembership]:
    statement = (
        select(CompanyMembership)
        .where(CompanyMembership.company_id == company_id)
        .options(selectinload(CompanyMembership.user))
        .order_by(CompanyMembership.role, CompanyMembership.user_id)
    )
    return list(session.exec(statement).all())


def get_company_membership(
    session: Session,
    company_id: UUID,
    user_id: UUID,
) -> CompanyMembership | None:
    statement = (
        select(CompanyMembership)
        .where(
            CompanyMembership.company_id == company_id,
            CompanyMembership.user_id == user_id,
        )
        .options(selectinload(CompanyMembership.user))
    )
    return session.exec(statement).first()


def add_company_member(
    session: Session,
    company_id: UUID,
    user: User,
    role: str,
) -> CompanyMembership:
    membership = CompanyMembership(
        company_id=company_id,
        user_id=user.id,
        role=role,
        status="active",
    )
    session.add(membership)
    session.commit()
    return get_company_membership(session, company_id, user.id) or membership


def update_company_member(
    session: Session,
    membership: CompanyMembership,
    *,
    role: str | None,
    status: str | None,
) -> CompanyMembership:
    if role is not None:
        membership.role = role
    if status is not None:
        membership.status = status
    session.add(membership)
    session.commit()
    return (
        get_company_membership(session, membership.company_id, membership.user_id)
        or membership
    )


def remove_company_member(session: Session, membership: CompanyMembership) -> None:
    session.delete(membership)
    session.commit()


def active_owner_count(session: Session, company_id: UUID) -> int:
    statement = select(func.count()).select_from(CompanyMembership).where(
        CompanyMembership.company_id == company_id,
        CompanyMembership.role == "owner",
        CompanyMembership.status == "active",
    )
    return session.exec(statement).one()
