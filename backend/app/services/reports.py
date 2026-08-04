"""Generation of downloadable prediction-history reports."""

import csv
from datetime import datetime, timezone
from io import BytesIO, StringIO

from openpyxl import Workbook
from openpyxl.styles import Font
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfgen import canvas
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models import PredictionHistory, User


class ReportService:
    def __init__(self, session: Session) -> None: self._session = session

    def generate_prediction_history(self, user: User, report_format: str) -> tuple[bytes, str, str]:
        records = list(self._session.scalars(select(PredictionHistory).where(PredictionHistory.user_id == user.id).order_by(PredictionHistory.created_at.desc())))
        rows = [(record.prediction, record.confidence, record.freshness_status, record.created_at) for record in records]
        timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
        if report_format == "csv": return self._csv(rows, user), "text/csv", f"prediction_history_{timestamp}.csv"
        if report_format == "xlsx": return self._xlsx(rows, user), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", f"prediction_history_{timestamp}.xlsx"
        if report_format == "pdf": return self._pdf(rows, user), "application/pdf", f"prediction_history_{timestamp}.pdf"
        raise ValueError("Unsupported report format")

    @staticmethod
    def _headers() -> list[str]: return ["Food Prediction", "Confidence", "Freshness", "Timestamp", "User"]

    def _csv(self, rows: list[tuple], user: User) -> bytes:
        output = StringIO(); writer = csv.writer(output); writer.writerow(self._headers())
        for prediction, confidence, status, created_at in rows: writer.writerow([prediction, f"{confidence * 100:.2f}%", status, created_at.isoformat(), user.email])
        return output.getvalue().encode("utf-8-sig")

    def _xlsx(self, rows: list[tuple], user: User) -> bytes:
        workbook = Workbook(); sheet = workbook.active; sheet.title = "Prediction History"; sheet.append(self._headers())
        for cell in sheet[1]: cell.font = Font(bold=True)
        for prediction, confidence, status, created_at in rows: sheet.append([prediction, confidence, status, created_at, user.email])
        sheet.column_dimensions["A"].width = 24; sheet.column_dimensions["B"].width = 14; sheet.column_dimensions["C"].width = 14; sheet.column_dimensions["D"].width = 28; sheet.column_dimensions["E"].width = 32
        for cell in sheet["B"][1:]: cell.number_format = "0.00%"
        output = BytesIO(); workbook.save(output); return output.getvalue()

    def _pdf(self, rows: list[tuple], user: User) -> bytes:
        output = BytesIO(); pdf = canvas.Canvas(output, pagesize=landscape(A4)); width, height = landscape(A4)
        pdf.setFont("Helvetica-Bold", 16); pdf.drawString(36, height - 40, "AI Food Freshness Prediction History")
        pdf.setFont("Helvetica", 9); pdf.drawString(36, height - 58, f"User: {user.email}")
        y = height - 90
        for index, heading in enumerate(self._headers()): pdf.setFont("Helvetica-Bold", 9); pdf.drawString(36 + index * 145, y, heading)
        y -= 16; pdf.setFont("Helvetica", 8)
        for prediction, confidence, status, created_at in rows:
            if y < 40: pdf.showPage(); y = height - 40; pdf.setFont("Helvetica", 8)
            values = [prediction, f"{confidence * 100:.2f}%", status, created_at.strftime("%Y-%m-%d %H:%M"), user.email]
            for index, value in enumerate(values): pdf.drawString(36 + index * 145, y, str(value)[:24])
            y -= 14
        pdf.save(); return output.getvalue()
