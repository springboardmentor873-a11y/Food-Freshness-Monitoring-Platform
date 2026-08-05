from typing import Optional
from fastapi import APIRouter, Depends, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.report_service import create_report
from app.utils.deps import get_optional_current_user
from app.models.user import User

router = APIRouter(tags=["Reports Export"])

@router.get("/reports/pdf")
@router.post("/reports/pdf")
@router.get("/api/reports/pdf")
@router.post("/api/reports/pdf")
def download_pdf_report(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    user_id = current_user.id if current_user else 1
    report = create_report(db, user_id, report_type="pdf")
    return FileResponse(
        path=report.file_path,
        media_type="application/pdf",
        filename=f"Food_Freshness_Report_{report.id}.pdf"
    )

@router.get("/reports/csv")
@router.post("/reports/csv")
@router.get("/api/reports/csv")
@router.post("/api/reports/csv")
def download_csv_report(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    user_id = current_user.id if current_user else 1
    report = create_report(db, user_id, report_type="csv")
    return FileResponse(
        path=report.file_path,
        media_type="text/csv",
        filename=f"Food_Freshness_Report_{report.id}.csv"
    )
