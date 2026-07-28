"""FastAPI application entry point and lifecycle configuration."""

from __future__ import annotations

import asyncio
import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.router import api_router
from app.core.config import settings
from app.database.mongodb import close_mongo_client
from app.services.inference import InferenceError
from app.services.model_loader import ModelLoadError, get_model
from app.services.preprocessing import ImageValidationError


logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    """Initialize shared application resources and release them on shutdown."""
    try:
        await asyncio.to_thread(get_model)
    except ModelLoadError:
        logger.critical("Application startup aborted because the AI model could not load")
        raise

    logger.info("AI Food Freshness Monitoring API started")
    try:
        yield
    finally:
        await asyncio.to_thread(close_mongo_client)
        logger.info("AI Food Freshness Monitoring API stopped")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Backend API for AI Food Freshness Monitoring System",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(ImageValidationError)
async def image_validation_exception_handler(
    _: Request,
    exc: ImageValidationError,
) -> JSONResponse:
    """Return invalid image errors as a consistent client response."""
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": str(exc)},
    )


@app.exception_handler(InferenceError)
@app.exception_handler(ModelLoadError)
async def inference_exception_handler(
    _: Request,
    exc: InferenceError | ModelLoadError,
) -> JSONResponse:
    """Hide model internals while reporting a temporarily unavailable service."""
    logger.exception("Prediction service error", exc_info=exc)
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={"detail": "Prediction service is currently unavailable"},
    )


@app.exception_handler(RequestValidationError)
async def request_validation_exception_handler(
    _: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    """Return FastAPI request validation errors using the standard 422 status."""
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors()},
    )


app.include_router(api_router, prefix=settings.API_PREFIX)


@app.get("/", tags=["System"])
async def root() -> dict[str, str]:
    """Return an API availability message."""
    return {"message": f"Welcome to {settings.APP_NAME}", "status": "Running"}


@app.get("/health", tags=["System"])
async def health() -> dict[str, str]:
    """Return the process health status after successful lifespan startup."""
    return {"status": "Healthy"}
