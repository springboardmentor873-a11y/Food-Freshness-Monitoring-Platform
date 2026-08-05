from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.admin import AdminLogin, AdminDashboardStats
from app.schemas.user import TokenResponse
from app.services.auth_service import authenticate_admin
from app.services.admin_service import (
    get_admin_dashboard_metrics,
    get_admin_users,
    get_user_login_history,
    update_user_by_admin,
    delete_user_by_admin,
    deactivate_user_by_admin,
    get_food_stats,
    get_system_status,
    get_analytics_trends,
)
from app.utils.deps import get_current_admin
from app.models.user import User

router = APIRouter(tags=["Admin Governance"])

@router.post("/admin/login", response_model=TokenResponse)
@router.post("/api/admin/login", response_model=TokenResponse)
def admin_login(data: AdminLogin, db: Session = Depends(get_db)):
    user, token = authenticate_admin(db, data)
    return TokenResponse(
        token=token,
        token_type="bearer",
        id=str(user.id),
        name=user.full_name,
        email=user.email,
        role=user.role,
        username=user.username,
        profile_photo=user.profile_photo
    )

@router.get("/admin/dashboard", response_model=AdminDashboardStats)
@router.get("/api/admin/dashboard", response_model=AdminDashboardStats)
def get_dashboard(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    return get_admin_dashboard_metrics(db)

@router.get("/admin/users")
@router.get("/api/admin/users")
def list_users(
    search: str = Query("", alias="search"),
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return get_admin_users(db, search=search)

@router.get("/admin/users/login-history")
@router.get("/api/admin/users/login-history")
def login_history(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    return get_user_login_history(db)

@router.put("/admin/users/{user_id}")
@router.put("/api/admin/users/{user_id}")
def update_user(user_id: int, data: dict, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    return update_user_by_admin(db, user_id, data)

@router.delete("/admin/users/{user_id}")
@router.delete("/api/admin/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    return delete_user_by_admin(db, user_id)

@router.patch("/admin/users/{user_id}/deactivate")
@router.patch("/api/admin/users/{user_id}/deactivate")
def deactivate_user(user_id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    return deactivate_user_by_admin(db, user_id)

@router.get("/admin/food-stats")
@router.get("/api/admin/food-stats")
def food_stats(db: Session = Depends(get_db)):
    return get_food_stats(db)

@router.get("/admin/system/status")
@router.get("/api/admin/system/status")
def system_status(db: Session = Depends(get_db)):
    return get_system_status(db)

@router.get("/admin/analytics/trends")
@router.get("/api/admin/analytics/trends")
def analytics_trends(db: Session = Depends(get_db)):
    return get_analytics_trends(db)
