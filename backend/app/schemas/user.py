from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserRegister(BaseModel):
    name: Optional[str] = None
    full_name: Optional[str] = None
    username: Optional[str] = None
    email: EmailStr
    password: str = Field(..., min_length=6)
    mobile_number: Optional[str] = None
    gender: Optional[str] = None
    role: Optional[str] = "Consumer"

class UserLogin(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    password: str
    role: Optional[str] = "Consumer"

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    mobile_number: Optional[str] = None
    gender: Optional[str] = None
    profile_photo: Optional[str] = None

class UserPasswordChange(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=6)

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    reset_token: str
    new_password: str = Field(..., min_length=6)

class UserResponse(BaseModel):
    id: int
    full_name: str
    username: str
    email: EmailStr
    mobile_number: Optional[str] = None
    gender: Optional[str] = None
    profile_photo: Optional[str] = None
    role: str
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    token: str
    token_type: str = "bearer"
    id: str
    name: str
    email: str
    role: str
    username: Optional[str] = None
    profile_photo: Optional[str] = None
