"""Inventory application service."""

from __future__ import annotations

from pathlib import Path
from uuid import UUID, uuid4


from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.models import InventoryItem, User
from app.repositories.inventory import InventoryRepository
from app.schemas.inventory import InventoryCreate, InventoryUpdate
from app.services.inference import predict_image


class InventoryNotFoundError(ValueError): pass


class InventoryService:
    def __init__(self, session: Session) -> None:
        self._session = session; self._repository = InventoryRepository(session)

    def create(self, user: User, payload: InventoryCreate) -> InventoryItem:
        item = self._repository.create(InventoryItem(user_id=user.id, **payload.model_dump()))
        self._session.commit(); self._session.refresh(item); return item

    def list(self, user: User, **filters: object) -> tuple[list[InventoryItem], int]:
        return self._repository.list(user.id, **filters)

    def get(self, user: User, item_id: UUID) -> InventoryItem:
        item = self._repository.get(item_id, user.id)
        if item is None: raise InventoryNotFoundError("Inventory item was not found")
        return item

    def update(self, user: User, item_id: UUID, payload: InventoryUpdate) -> InventoryItem:
        item = self.get(user, item_id)
        for field, value in payload.model_dump(exclude_unset=True).items(): setattr(item, field, value)
        if item.expiry_date < item.purchase_date: raise ValueError("expiry_date cannot precede purchase_date")
        self._session.commit(); self._session.refresh(item); return item

    def delete(self, user: User, item_id: UUID) -> None:
        item = self.get(user, item_id); self._repository.delete(item); self._session.commit()

    def bulk_delete(self, user: User, item_ids: list[UUID]) -> int:
        deleted_count = 0
        for item_id in item_ids:
            item = self._repository.get(item_id, user.id)
            if item:
                self._repository.delete(item)
                deleted_count += 1
        self._session.commit()
        return deleted_count

    async def bulk_import(self, user: User, file: UploadFile) -> tuple[int, int, list[str]]:
        import csv
        import io
        from datetime import date as date_type

        content = (await file.read()).decode("utf-8-sig")
        reader = csv.DictReader(io.StringIO(content))
        imported_count = 0
        failed_count = 0
        errors: list[str] = []

        for index, row in enumerate(reader, start=2):
            try:
                food_name = row.get("food_name") or row.get("Food Name") or ""
                category = row.get("category") or row.get("Category") or "General"
                quantity = int(row.get("quantity") or row.get("Quantity") or 1)
                purchase_date_str = row.get("purchase_date") or row.get("Purchase Date") or str(date_type.today())
                expiry_date_str = row.get("expiry_date") or row.get("Expiry Date") or str(date_type.today())
                storage_location = row.get("storage_location") or row.get("Storage Location") or "Default Storage"

                if not food_name.strip():
                    raise ValueError("Food name is required")

                p_date = date_type.fromisoformat(purchase_date_str)
                e_date = date_type.fromisoformat(expiry_date_str)

                item = InventoryItem(
                    user_id=user.id,
                    food_name=food_name.strip(),
                    category=category.strip(),
                    quantity=quantity,
                    purchase_date=p_date,
                    expiry_date=e_date,
                    storage_location=storage_location.strip(),
                )
                self._repository.create(item)
                imported_count += 1
            except Exception as exc:
                failed_count += 1
                errors.append(f"Row {index}: {exc}")

        self._session.commit()
        return imported_count, failed_count, errors

    async def attach_image_and_predict(self, user: User, item_id: UUID, image: UploadFile, analyze: bool) -> InventoryItem:
        item = self.get(user, item_id)
        result = await predict_image(image) if analyze else None
        await image.seek(0)
        suffix = Path(image.filename or "image").suffix.lower() or ".jpg"
        upload_dir = Path(settings.UPLOAD_FOLDER); upload_dir.mkdir(parents=True, exist_ok=True)
        destination = upload_dir / f"{uuid4()}{suffix}"
        destination.write_bytes(await image.read())
        item.image_path = str(destination)
        if result:
            item.prediction, item.confidence = result.predicted_class, result.confidence
            item.freshness_status = "fresh" if result.predicted_class.startswith("fresh_") else "spoiled"
        self._session.commit(); self._session.refresh(item); return item

