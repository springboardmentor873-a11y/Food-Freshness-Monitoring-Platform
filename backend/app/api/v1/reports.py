"""Authenticated report download endpoints."""

from typing import Annotated, Literal

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_active_user
from app.database.models import User
from app.database.postgres import get_db
from app.services.reports import ReportService

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/prediction-history")
def download_prediction_history(format: Literal["csv", "xlsx", "pdf"], user: Annotated[User, Depends(get_current_active_user)], db: Annotated[Session, Depends(get_db)]) -> StreamingResponse:
    try: content, media_type, filename = ReportService(db).generate_prediction_history(user, format)
    except ValueError as exc: raise HTTPException(422, str(exc)) from exc
    return StreamingResponse(iter([content]), media_type=media_type, headers={"Content-Disposition": f'attachment; filename="{filename}"'})
