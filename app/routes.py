from fastapi import APIRouter
from app.api import auth, inventory, analysis, predict, recommend, dataset, dashboard, storage

api_router = APIRouter(prefix="/api")
api_router.include_router(auth, prefix="", tags=["auth"])
api_router.include_router(inventory, prefix="/items", tags=["inventory"])
api_router.include_router(analysis, prefix="/assess", tags=["analysis"])
api_router.include_router(predict, prefix="/predict", tags=["predict"])
api_router.include_router(recommend, prefix="/recommend", tags=["recommend"])
api_router.include_router(dataset, prefix="/dataset", tags=["dataset"])
api_router.include_router(dashboard, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(storage, prefix="/storage", tags=["storage"])
