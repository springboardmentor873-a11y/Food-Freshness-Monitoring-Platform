"""Authentication, token rotation, and current-user endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_active_user
from app.database.models import User
from app.database.postgres import get_db
from app.schemas.auth import (
    ChangePasswordRequest,
    ForgotPasswordRequest,
    GoogleLoginRequest,
    LoginRequest,
    ProfileUpdateRequest,
    RefreshRequest,
    RegisterRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserResponse,
)

from app.services.auth import AuthService, AuthenticationError, EmailAlreadyRegisteredError


router = APIRouter(prefix="/auth", tags=["Authentication"])


def get_auth_service(db: Annotated[Session, Depends(get_db)]) -> AuthService:
    return AuthService(db)


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, service: Annotated[AuthService, Depends(get_auth_service)]) -> User:
    try:
        return service.register(**payload.model_dump())
    except EmailAlreadyRegisteredError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, service: Annotated[AuthService, Depends(get_auth_service)]) -> TokenResponse:
    try:
        return service.authenticate(**payload.model_dump())
    except AuthenticationError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc), headers={"WWW-Authenticate": "Bearer"}) from exc


@router.post("/google", response_model=TokenResponse)
def google_login(payload: GoogleLoginRequest, service: Annotated[AuthService, Depends(get_auth_service)]) -> TokenResponse:
    try:
        return service.google_authenticate(**payload.model_dump())
    except AuthenticationError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc



@router.post("/refresh", response_model=TokenResponse)
def refresh(payload: RefreshRequest, service: Annotated[AuthService, Depends(get_auth_service)]) -> TokenResponse:
    try:
        return service.refresh(payload.refresh_token)
    except AuthenticationError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc), headers={"WWW-Authenticate": "Bearer"}) from exc


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(payload: RefreshRequest, service: Annotated[AuthService, Depends(get_auth_service)]) -> Response:
    service.logout(payload.refresh_token)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/me", response_model=UserResponse)
def get_profile(current_user: Annotated[User, Depends(get_current_active_user)]) -> User:
    return current_user


@router.patch("/me", response_model=UserResponse)
def update_profile(
    payload: ProfileUpdateRequest,
    current_user: Annotated[User, Depends(get_current_active_user)],
    service: Annotated[AuthService, Depends(get_auth_service)],
) -> User:
    try:
        return service.update_profile(current_user, **payload.model_dump(exclude_unset=True))
    except EmailAlreadyRegisteredError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc



@router.post("/change-password", status_code=status.HTTP_204_NO_CONTENT)
def change_password(
    payload: ChangePasswordRequest,
    current_user: Annotated[User, Depends(get_current_active_user)],
    service: Annotated[AuthService, Depends(get_auth_service)],
) -> None:
    try:
        service.change_password(current_user, payload.current_password, payload.new_password)
    except AuthenticationError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.post("/forgot-password")
def forgot_password(
    payload: ForgotPasswordRequest,
    service: Annotated[AuthService, Depends(get_auth_service)],
) -> dict[str, str]:
    token_or_msg = service.forgot_password(payload.email)
    return {"message": "Password reset token generated", "reset_token": token_or_msg}


@router.post("/reset-password", status_code=status.HTTP_204_NO_CONTENT)
def reset_password(
    payload: ResetPasswordRequest,
    service: Annotated[AuthService, Depends(get_auth_service)],
) -> None:
    try:
        service.reset_password(payload.token, payload.new_password)
    except AuthenticationError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

