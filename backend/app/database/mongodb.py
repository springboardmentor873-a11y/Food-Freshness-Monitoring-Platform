"""MongoDB client lifecycle and database access helpers."""

from __future__ import annotations

import logging
from threading import Lock
from typing import Any

from pymongo import MongoClient
from pymongo.database import Database
from pymongo.errors import PyMongoError

from app.core.config import settings


logger = logging.getLogger(__name__)

_client: MongoClient[dict[str, Any]] | None = None
_client_lock = Lock()


def get_mongo_client() -> MongoClient[dict[str, Any]]:
    """Return the shared, verified MongoDB client instance.

    Raises:
        RuntimeError: If MongoDB cannot be reached using the configured URI.
    """
    global _client

    if _client is not None:
        return _client

    with _client_lock:
        if _client is not None:
            return _client

        client = MongoClient(
            settings.MONGODB_URI,
            connectTimeoutMS=5_000,
            serverSelectionTimeoutMS=5_000,
            socketTimeoutMS=10_000,
            retryReads=True,
            retryWrites=True,
        )
        try:
            client.admin.command("ping")
        except PyMongoError as exc:
            client.close()
            logger.exception("Unable to connect to MongoDB")
            raise RuntimeError("MongoDB connection is unavailable") from exc

        _client = client
        logger.info("Connected to MongoDB database '%s'", settings.MONGODB_DATABASE)
        return _client


def get_mongo_database() -> Database[dict[str, Any]]:
    """Return the configured MongoDB database using the shared client."""
    return get_mongo_client()[settings.MONGODB_DATABASE]


def close_mongo_client() -> None:
    """Close the shared MongoDB client during application shutdown."""
    global _client

    with _client_lock:
        if _client is not None:
            _client.close()
            _client = None
