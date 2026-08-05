import os
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.schemas.user import UserResponse, UserUpdate, UserPasswordChange
from app.utils.deps import get_current_user
from app.utils.security import get_password_hash, verify_password
from app.models.user import User

router = APIRouter(tags=["User Profile"])

@router.get("/profile", response_model=UserResponse)
@router.get("/api/profile", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserResponse)
@router.put("/api/profile", response_model=UserResponse)
def update_profile(
    data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if data.full_name is not None:
        current_user.full_name = data.full_name
    if data.mobile_number is not None:
        current_user.mobile_number = data.mobile_number
    if data.gender is not None:
        current_user.gender = data.gender
    if data.profile_photo is not None:
        current_user.profile_photo = data.profile_photo

    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/profile/photo")
@router.post("/api/profile/photo")
def upload_profile_photo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
        raise HTTPException(status_code=400, detail="Invalid photo format. Use JPG, PNG or WEBP.")

    filename = f"avatar_{current_user.id}_{uuid.uuid4().hex[:6]}{ext}"
    path = os.path.join(settings.UPLOAD_DIR, filename)

    with open(path, "wb") as f:
        f.write(file.file.read())

    photo_url = f"/uploads/{filename}"
    current_user.profile_photo = photo_url
    db.commit()
    db.refresh(current_user)

    return {"message": "Profile photo updated", "profile_photo": photo_url}

@router.post("/profile/change-password")
@router.post("/api/profile/change-password")
def change_password(
    data: UserPasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not verify_password(data.old_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect existing password")

    current_user.password_hash = get_password_hash(data.new_password)
    db.commit()
    return {"message": "Password changed successfully"}
