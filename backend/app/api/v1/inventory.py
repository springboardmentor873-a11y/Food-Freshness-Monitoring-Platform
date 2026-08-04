"""Authenticated inventory CRUD and optional image analysis."""

from typing import Annotated, Literal
from uuid import UUID

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_active_user
from app.database.models import User
from app.database.postgres import get_db
from app.schemas.inventory import BulkDeleteRequest, BulkImportResponse, InventoryCreate, InventoryPage, InventoryResponse, InventoryUpdate
from app.services.inference import InferenceError
from app.services.inventory import InventoryNotFoundError, InventoryService
from app.services.preprocessing import ImageValidationError, SUPPORTED_CONTENT_TYPES



router = APIRouter(prefix="/inventory", tags=["Inventory"])

def get_service(db: Annotated[Session, Depends(get_db)]) -> InventoryService: return InventoryService(db)

@router.post("", response_model=InventoryResponse, status_code=status.HTTP_201_CREATED)
def create(payload: InventoryCreate, user: Annotated[User, Depends(get_current_active_user)], service: Annotated[InventoryService, Depends(get_service)]): return service.create(user, payload)

@router.get("", response_model=InventoryPage)
def list_items(user: Annotated[User, Depends(get_current_active_user)], service: Annotated[InventoryService, Depends(get_service)], search: str | None = None, category: str | None = None, page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100), sort_by: Literal["food_name", "category", "quantity", "purchase_date", "expiry_date", "created_at"] = "expiry_date", descending: bool = False):
    items, total = service.list(user, search=search, category=category, page=page, page_size=page_size, sort_by=sort_by, descending=descending)
    return InventoryPage(items=items, total=total, page=page, page_size=page_size)

@router.post("/bulk-delete")
def bulk_delete(payload: BulkDeleteRequest, user: Annotated[User, Depends(get_current_active_user)], service: Annotated[InventoryService, Depends(get_service)]):
    count = service.bulk_delete(user, payload.item_ids)
    return {"message": f"Successfully deleted {count} inventory items", "deleted_count": count}

@router.post("/bulk-import", response_model=BulkImportResponse)
async def bulk_import(file: Annotated[UploadFile, File()], user: Annotated[User, Depends(get_current_active_user)], service: Annotated[InventoryService, Depends(get_service)]):
    imported_count, failed_count, errors = await service.bulk_import(user, file)
    return BulkImportResponse(imported_count=imported_count, failed_count=failed_count, errors=errors)

@router.get("/{item_id}", response_model=InventoryResponse)
def get_item(item_id: UUID, user: Annotated[User, Depends(get_current_active_user)], service: Annotated[InventoryService, Depends(get_service)]):
    try: return service.get(user, item_id)
    except InventoryNotFoundError as exc: raise HTTPException(404, str(exc)) from exc

@router.patch("/{item_id}", response_model=InventoryResponse)
@router.put("/{item_id}", response_model=InventoryResponse)
def update(item_id: UUID, payload: InventoryUpdate, user: Annotated[User, Depends(get_current_active_user)], service: Annotated[InventoryService, Depends(get_service)]):
    try: return service.update(user, item_id, payload)
    except InventoryNotFoundError as exc: raise HTTPException(404, str(exc)) from exc
    except ValueError as exc: raise HTTPException(422, str(exc)) from exc


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(item_id: UUID, user: Annotated[User, Depends(get_current_active_user)], service: Annotated[InventoryService, Depends(get_service)]):
    try: service.delete(user, item_id)
    except InventoryNotFoundError as exc: raise HTTPException(404, str(exc)) from exc

@router.post("/{item_id}/image", response_model=InventoryResponse)
async def upload_image(item_id: UUID, image: Annotated[UploadFile, File()], user: Annotated[User, Depends(get_current_active_user)], service: Annotated[InventoryService, Depends(get_service)], analyze: bool = True):
    if image.content_type not in SUPPORTED_CONTENT_TYPES: raise HTTPException(415, "Only JPEG, PNG, and WEBP images are supported")
    try: return await service.attach_image_and_predict(user, item_id, image, analyze)
    except InventoryNotFoundError as exc: raise HTTPException(404, str(exc)) from exc
    except ImageValidationError as exc: raise HTTPException(422, str(exc)) from exc
    except InferenceError as exc: raise HTTPException(503, "Prediction service is currently unavailable") from exc
    finally: await image.close()

