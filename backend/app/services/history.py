"""Prediction history recording and management service."""

from pathlib import Path
from uuid import UUID, uuid4

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.models import PredictionHistory, User
from app.repositories.history import PredictionHistoryRepository
from app.services.inference import InferenceResult


class PredictionHistoryNotFoundError(ValueError): pass


class PredictionHistoryService:
    def __init__(self, session: Session) -> None:
        self._session = session; self._repository = PredictionHistoryRepository(session)

    async def record(self, user: User, image: UploadFile, result: InferenceResult) -> PredictionHistory:
        suffix = Path(image.filename or "image").suffix.lower() or ".jpg"
        directory = Path(settings.UPLOAD_FOLDER) / "predictions"; directory.mkdir(parents=True, exist_ok=True)
        path = directory / f"{uuid4()}{suffix}"
        await image.seek(0)
        path.write_bytes(await image.read())
        record = self._repository.create(PredictionHistory(user_id=user.id, image_path=str(path), prediction=result.predicted_class, confidence=result.confidence, freshness_status="fresh" if result.predicted_class.startswith("fresh_") else "spoiled"))
        self._session.commit(); self._session.refresh(record); return record

    def list(self, user: User, **filters: object) -> tuple[list[PredictionHistory], int]: return self._repository.list(user.id, **filters)

    def delete(self, user: User, history_id: UUID) -> None:
        record = self._repository.get(history_id, user.id)
        if record is None: raise PredictionHistoryNotFoundError("Prediction history record was not found")
        self._repository.delete(record); self._session.commit()
