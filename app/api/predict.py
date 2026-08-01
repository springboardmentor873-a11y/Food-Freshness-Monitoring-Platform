from fastapi import APIRouter, HTTPException
from app.models import ShelfLifeRequest
from app.ml.predict import predict_shelf_life

router = APIRouter()

@router.post("/", response_model=dict)
def shelf_life(request: ShelfLifeRequest):
    try:
        prediction = predict_shelf_life(request)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
