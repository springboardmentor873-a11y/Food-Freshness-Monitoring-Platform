import os
import uuid
from datetime import datetime
from typing import Dict, Any
from sqlalchemy.orm import Session
from app.config import settings
from app.models.prediction import Prediction
from app.models.inventory import InventoryItem
from app.models.report import Report
from app.utils.report_generator import generate_pdf_report, generate_csv_report

def create_report(db: Session, user_id: int, report_type: str = "pdf") -> Report:
    predictions = db.query(Prediction).filter(Prediction.user_id == user_id).all()
    if not predictions:
        predictions = db.query(Prediction).limit(20).all()

    inventory = db.query(InventoryItem).filter(InventoryItem.user_id == user_id).all()

    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    report_filename = f"report_{user_id}_{timestamp}_{uuid.uuid4().hex[:6]}.{report_type.lower()}"
    file_path = os.path.join(settings.UPLOAD_DIR, "reports", report_filename)
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    title = f"Food Freshness & Inventory Analysis Report ({report_type.upper()})"

    if report_type.lower() == "pdf":
        generate_pdf_report(title, predictions, inventory, file_path)
    else:
        generate_csv_report(predictions, inventory, file_path)

    report_record = Report(
        user_id=user_id,
        title=title,
        report_type=report_type.lower(),
        file_path=file_path,
        created_at=datetime.utcnow()
    )

    db.add(report_record)
    db.commit()
    db.refresh(report_record)
    return report_record
