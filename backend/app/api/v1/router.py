"""Central router composition for version 1 of the public API."""

from fastapi import APIRouter

from app.api.v1.predictions import router as predictions_router


api_router = APIRouter()
api_router.include_router(predictions_router)
