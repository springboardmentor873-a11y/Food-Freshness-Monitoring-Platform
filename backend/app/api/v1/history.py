"""Authenticated prediction history endpoints."""

from typing import Annotated, Literal
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_active_user
from app.database.models import User
from app.database.postgres import get_db
from app.schemas.history import PredictionHistoryPage
from app.services.history import PredictionHistoryNotFoundError, PredictionHistoryService

router = APIRouter(prefix="/prediction-history", tags=["Prediction History"])
def get_service(db: Annotated[Session, Depends(get_db)]) -> PredictionHistoryService: return PredictionHistoryService(db)

@router.get("", response_model=PredictionHistoryPage)
def list_history(user: Annotated[User, Depends(get_current_active_user)], service: Annotated[PredictionHistoryService, Depends(get_service)], search: str | None = None, freshness_status: Literal["fresh", "spoiled"] | None = None, page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100)):
    items, total = service.list(user, search=search, freshness_status=freshness_status, page=page, page_size=page_size)
    return PredictionHistoryPage(items=items, total=total, page=page, page_size=page_size)

@router.delete("/{history_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_history(history_id: UUID, user: Annotated[User, Depends(get_current_active_user)], service: Annotated[PredictionHistoryService, Depends(get_service)]):
    try: service.delete(user, history_id)
    except PredictionHistoryNotFoundError as exc: raise HTTPException(status.HTTP_404_NOT_FOUND, str(exc)) from exc
