from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserRegister, UserLogin, TokenResponse, ForgotPasswordRequest, ResetPasswordRequest
from app.services.auth_service import register_user, authenticate_user, logout_user
from app.utils.deps import get_current_user
from app.models.user import User

router = APIRouter(tags=["Authentication"])

@router.post("/auth/register", response_model=TokenResponse)
@router.post("/api/auth/register", response_model=TokenResponse)
def register(data: UserRegister, db: Session = Depends(get_db)):
    user, token = register_user(db, data)
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

@router.post("/auth/login", response_model=TokenResponse)
@router.post("/api/auth/login", response_model=TokenResponse)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user, token = authenticate_user(db, data)
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

@router.post("/auth/forgot-password")
@router.post("/api/auth/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email.lower().strip()).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email address not found")
    return {"message": f"Password reset link dispatched to {data.email}"}

@router.post("/auth/reset-password")
@router.post("/api/auth/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email.lower().strip()).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email address not found")
    from app.utils.security import get_password_hash
    user.password_hash = get_password_hash(data.new_password)
    db.commit()
    return {"message": "Password successfully reset. Please log in with your new password."}

@router.post("/auth/logout")
@router.post("/api/auth/logout")
def logout(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    logout_user(db, current_user)
    return {"message": "Logged out successfully"}
