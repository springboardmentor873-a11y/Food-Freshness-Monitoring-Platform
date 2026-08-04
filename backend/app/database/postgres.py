"""PostgreSQL engine with SQLite fallback for seamless execution."""

from __future__ import annotations

import logging

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

logger = logging.getLogger(__name__)

def create_db_engine():
    try:
        eng = create_engine(
            settings.POSTGRES_DSN,
            pool_pre_ping=True,
            pool_recycle=1_800,
            pool_size=10,
            max_overflow=20,
        )
        with eng.connect() as conn:
            pass
        return eng
    except Exception as exc:
        logger.warning(
            "PostgreSQL connection failed (%s). Falling back to SQLite local database.",
            exc,
        )
        sqlite_eng = create_engine(
            "sqlite:///./app_local.db",
            connect_args={"check_same_thread": False},
        )
        from app.database.models import Base
        Base.metadata.create_all(bind=sqlite_eng)

        # Migrate new columns for SQLite if missing
        with sqlite_eng.connect() as conn:
            from sqlalchemy import text
            columns = [row[1] for row in conn.execute(text("PRAGMA table_info(users)")).fetchall()]
            if "theme" not in columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN theme VARCHAR(20) DEFAULT 'light' NOT NULL"))

            if "language" not in columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN language VARCHAR(10) DEFAULT 'en' NOT NULL"))
            if "phone_number" not in columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN phone_number VARCHAR(30)"))
            if "avatar_url" not in columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500)"))
            if "notification_preferences" not in columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN notification_preferences TEXT"))
            conn.commit()

        return sqlite_eng


engine = create_db_engine()

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
    class_=Session,
)


def get_db() -> Generator[Session, None, None]:
    """Yield a database session and always release its connection safely."""
    session = SessionLocal()
    try:
        yield session
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()

