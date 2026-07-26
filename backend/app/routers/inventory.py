from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from app.core.security import get_current_user

router = APIRouter(prefix="/api/inventory", tags=["Food Inventory"])


@router.post("", response_model=schemas.FoodItemOut, status_code=201)
def create_food_item(
    payload: schemas.FoodItemCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    item = models.FoodItem(**payload.model_dump(), owner_id=current_user.id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.get("", response_model=list[schemas.FoodItemOut])
def list_food_items(
    category: Optional[models.FoodCategory] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    query = db.query(models.FoodItem)
    # Consumers only see their own items; staff roles see everything.
    if current_user.role == models.UserRole.consumer:
        query = query.filter(models.FoodItem.owner_id == current_user.id)
    if category:
        query = query.filter(models.FoodItem.category == category)
    return query.order_by(models.FoodItem.received_date.desc()).all()


@router.get("/{item_id}", response_model=schemas.FoodItemOut)
def get_food_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    item = db.query(models.FoodItem).filter(models.FoodItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Food item not found.")
    return item


@router.patch("/{item_id}", response_model=schemas.FoodItemOut)
def update_food_item(
    item_id: int,
    payload: schemas.FoodItemUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    item = db.query(models.FoodItem).filter(models.FoodItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Food item not found.")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=204)
def delete_food_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    item = db.query(models.FoodItem).filter(models.FoodItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Food item not found.")
    db.delete(item)
    db.commit()
    return None
