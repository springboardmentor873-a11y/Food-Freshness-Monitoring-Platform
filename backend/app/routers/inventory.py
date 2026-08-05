from typing import Optional, List
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.inventory import InventoryCreate, InventoryUpdate, InventoryResponse
from app.services.inventory_service import (
    create_inventory_item,
    get_user_inventory,
    update_inventory_item,
    delete_inventory_item,
)
from app.utils.deps import get_current_user, get_optional_current_user
from app.models.user import User

router = APIRouter(tags=["Inventory Management"])

@router.post("/inventory", response_model=InventoryResponse)
@router.post("/api/inventory", response_model=InventoryResponse)
def add_inventory_item(
    data: InventoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_inventory_item(db, current_user.id, data)

@router.get("/inventory", response_model=List[InventoryResponse])
@router.get("/api/inventory", response_model=List[InventoryResponse])
def list_inventory(
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    # Default to sample user_id 1 if unauthenticated demo access
    user_id = current_user.id if current_user else 1
    return get_user_inventory(db, user_id, category=category, status_filter=status)

@router.put("/inventory/{item_id}", response_model=InventoryResponse)
@router.put("/api/inventory/{item_id}", response_model=InventoryResponse)
def update_item(
    item_id: int,
    data: InventoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return update_inventory_item(db, item_id, current_user.id, data)

@router.delete("/inventory/{item_id}")
@router.delete("/api/inventory/{item_id}")
def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return delete_inventory_item(db, item_id, current_user.id)
