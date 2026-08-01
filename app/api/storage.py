from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.models import StorageCondition, User
from app.database import add_storage_condition, list_storage_conditions
from app.security import get_current_user

router = APIRouter()


@router.post("/conditions", response_model=StorageCondition)
def add_condition(condition: StorageCondition, user: User = Depends(get_current_user)):
    try:
        return add_storage_condition(condition)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/conditions", response_model=List[StorageCondition])
def get_conditions(user: User = Depends(get_current_user)):
    return list_storage_conditions()
