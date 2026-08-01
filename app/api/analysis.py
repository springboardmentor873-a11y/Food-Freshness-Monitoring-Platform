from fastapi import APIRouter, UploadFile, File, HTTPException
from app.ml.analysis import analyze_image
from app.models import ImageAssessment

router = APIRouter()

@router.post("/", response_model=ImageAssessment)
def assess_image(file: UploadFile = File(...)):
    try:
        result = analyze_image(file)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
