import json
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from typing import List
from pathlib import Path
from app.models import InventoryItem, User
from app.database import list_items, add_item, get_item, update_item, delete_item
from app.security import get_current_user

router = APIRouter()
EXPORT_FILE = Path("data/inventory_export.json")


@router.get("/", response_model=List[InventoryItem])
def get_items(user: User = Depends(get_current_user)):
    return list_items()


@router.get("/{item_id}", response_model=InventoryItem)
def read_item(item_id: int, user: User = Depends(get_current_user)):
    item = get_item(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return item


@router.post("/", response_model=InventoryItem)
def create_item(item: InventoryItem, user: User = Depends(get_current_user)):
    try:
        return add_item(item)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{item_id}", response_model=InventoryItem)
def edit_item(item_id: int, item: InventoryItem, user: User = Depends(get_current_user)):
    try:
        return update_item(item_id, item)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.delete("/{item_id}")
def remove_item(item_id: int, user: User = Depends(get_current_user)):
    delete_item(item_id)
    return {"message": "Inventory item deleted."}


@router.get("/export")
def export_items(user: User = Depends(get_current_user)):
    items = [item.dict() for item in list_items()]
    EXPORT_FILE.parent.mkdir(parents=True, exist_ok=True)
    EXPORT_FILE.write_text(json.dumps(items, indent=2), encoding="utf-8")
    return FileResponse(path=str(EXPORT_FILE), filename="inventory_export.json", media_type="application/json")
