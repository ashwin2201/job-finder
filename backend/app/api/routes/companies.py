from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session

from core.auth import get_current_user, require_company_roles
from core.database import get_session
from models.company import CompanyMembership
from models.identity import User
from schemas.company import (
    CompanyCreate,
    CompanyMemberCreate,
    CompanyMemberRead,
    CompanyMemberUpdate,
    CompanyRead,
    CompanyUpdate,
)
from services.companies import (
    active_owner_count,
    add_company_member,
    archive_company,
    create_company,
    get_company,
    get_company_membership,
    list_company_members,
    remove_company_member,
    update_company,
    update_company_member,
)


router = APIRouter(prefix="/api/companies")

company_member = require_company_roles("owner", "admin", "recruiter", "member")
company_admin = require_company_roles("owner", "admin")
company_owner = require_company_roles("owner")


@router.post("", response_model=CompanyRead, status_code=status.HTTP_201_CREATED)
def post_company(
    data: CompanyCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return create_company(session, data.name, current_user)


@router.get("/{company_id}", response_model=CompanyRead)
def read_company(company_id: UUID, session: Session = Depends(get_session)):
    company = get_company(session, company_id)
    if company is None or company.status != "active":
        raise HTTPException(status_code=404, detail="Company not found")
    return company


@router.patch("/{company_id}", response_model=CompanyRead)
def patch_company(
    data: CompanyUpdate,
    membership: CompanyMembership = Depends(company_admin),
    session: Session = Depends(get_session),
):
    return update_company(session, membership.company, data.name)

      
@router.delete("/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_company(
    membership: CompanyMembership = Depends(company_owner),
    session: Session = Depends(get_session),
) -> Response:
    archive_company(session, membership.company)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/{company_id}/members", response_model=list[CompanyMemberRead])
def read_company_members(
    company_id: UUID,
    _: CompanyMembership = Depends(company_member),
    session: Session = Depends(get_session),
):
    return list_company_members(session, company_id)


@router.post(
    "/{company_id}/members",
    response_model=CompanyMemberRead,
    status_code=status.HTTP_201_CREATED,
)
def post_company_member(
    company_id: UUID,
    data: CompanyMemberCreate,
    actor: CompanyMembership = Depends(company_admin),
    session: Session = Depends(get_session),
):
    if data.role == "owner" and actor.role != "owner":
        raise HTTPException(status_code=403, detail="Only an owner can add an owner")
    if get_company_membership(session, company_id, data.user_id) is not None:
        raise HTTPException(status_code=409, detail="User is already a company member")
    user = session.get(User, data.user_id)
    if user is None or user.account_status != "active":
        raise HTTPException(status_code=404, detail="Active user not found")
    return add_company_member(session, company_id, user, data.role)


def _check_member_change(
    session: Session,
    actor: CompanyMembership,
    target: CompanyMembership,
    *,
    role: str | None,
    member_status: str | None,
) -> None:
    if actor.role == "admin" and target.role == "owner":
        raise HTTPException(status_code=403, detail="Admins cannot manage owners")
    if role == "owner" and actor.role != "owner":
        raise HTTPException(status_code=403, detail="Only an owner can assign ownership")

    next_role = role if role is not None else target.role
    next_status = member_status if member_status is not None else target.status
    removes_active_owner = (
        target.role == "owner"
        and target.status == "active"
        and (next_role != "owner" or next_status != "active")
    )
    if removes_active_owner and active_owner_count(session, target.company_id) <= 1:
        raise HTTPException(status_code=409, detail="Company must retain an active owner")


@router.patch(
    "/{company_id}/members/{user_id}",
    response_model=CompanyMemberRead,
)
def patch_company_member(
    company_id: UUID,
    user_id: UUID,
    data: CompanyMemberUpdate,
    actor: CompanyMembership = Depends(company_admin),
    session: Session = Depends(get_session),
):
    target = get_company_membership(session, company_id, user_id)
    if target is None:
        raise HTTPException(status_code=404, detail="Company member not found")
    _check_member_change(
        session,
        actor,
        target,
        role=data.role,
        member_status=data.status,
    )
    return update_company_member(
        session,
        target,
        role=data.role,
        status=data.status,
    )


@router.delete(
    "/{company_id}/members/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_company_member(
    company_id: UUID,
    user_id: UUID,
    actor: CompanyMembership = Depends(company_admin),
    session: Session = Depends(get_session),
) -> Response:
    target = get_company_membership(session, company_id, user_id)
    if target is None:
        raise HTTPException(status_code=404, detail="Company member not found")
    _check_member_change(
        session,
        actor,
        target,
        role=None,
        member_status="suspended",
    )
    remove_company_member(session, target)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
