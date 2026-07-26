from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from app.core.security import get_current_user, require_roles
from app.models import UserRole

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get("/me", response_model=schemas.UserOut)
def read_own_profile(current_user: models.User = Depends(get_current_user)):
    return current_user


@router.get("", response_model=list[schemas.UserOut])
def list_users(
    db: Session = Depends(get_db),
    _admin: models.User = Depends(require_roles(UserRole.administrator)),
):
    """Admin-only: list all platform users."""
    return db.query(models.User).all()
