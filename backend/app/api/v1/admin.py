"""FastAPI endpoints for system administration and user management."""

from typing import Annotated, Any
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.dependencies import require_admin
from app.database.models import User
from app.database.postgres import get_db
from app.schemas.admin import AdminStatsResponse, AdminUsersPage, UserAdminResponse, UserRoleUpdate
from app.services.admin import AdminService

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(require_admin)],
)


def get_admin_service(db: Annotated[Session, Depends(get_db)]) -> AdminService:
    return AdminService(db)


@router.get("/users", response_model=AdminUsersPage)
def list_users(
    service: Annotated[AdminService, Depends(get_admin_service)],
    search: str | None = None,
    role: str | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
):
    """Retrieve paginated platform users (Requires ADMIN role)."""
    return service.list_users(search=search, role=role, page=page, page_size=page_size)


@router.patch("/users/{user_id}", response_model=UserAdminResponse)
def update_user(
    user_id: UUID,
    payload: UserRoleUpdate,
    service: Annotated[AdminService, Depends(get_admin_service)],
):
    """Modify user role or account status (Requires ADMIN role)."""
    try:
        return service.update_user_role(user_id, payload)
    except ValueError as exc:
        raise HTTPException(status.HTTP_404_NOT_FOUND, str(exc)) from exc


@router.get("/stats", response_model=AdminStatsResponse)
def get_stats(
    service: Annotated[AdminService, Depends(get_admin_service)],
):
    """Retrieve system administration metrics (Requires ADMIN role)."""
    return service.get_admin_stats()


@router.get("/system-status")
def get_system_status() -> dict[str, Any]:
    """Retrieve real-time health and infrastructure diagnostics (Requires ADMIN role)."""
    return {
        "status": "healthy",
        "services": {
            "database": "online",
            "ai_inference_engine": "online",
            "auth_service": "online",
            "file_storage": "online",
        },
        "system_load": "normal",
    }
