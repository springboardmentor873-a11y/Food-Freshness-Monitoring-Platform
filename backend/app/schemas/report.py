from datetime import datetime
from pydantic import BaseModel

class ReportResponse(BaseModel):
    id: int
    user_id: int
    title: str
    report_type: str
    file_path: str
    created_at: datetime

    class Config:
        from_attributes = True
