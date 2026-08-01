from fastapi import APIRouter, HTTPException
from app.models import RecommendationRequest, RecommendationResponse
from app.ml.recommend import generate_recommendations

router = APIRouter()

@router.post("/", response_model=RecommendationResponse)
def recommend(request: RecommendationRequest):
    try:
        response = generate_recommendations(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
