import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Save database in backend directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SQLALCHEMY_DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'freshness_watch.db')}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)
    
    # Auto-migrate missing columns for existing SQLite tables
    from sqlalchemy import text
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE inventory ADD COLUMN predicted_category VARCHAR"))
            conn.commit()
        except Exception:
            pass
        try:
            conn.execute(text("ALTER TABLE inventory ADD COLUMN risk_level VARCHAR DEFAULT 'Low Risk'"))
            conn.commit()
        except Exception:
            pass
        try:
            conn.execute(text("ALTER TABLE inventory ADD COLUMN remaining_shelf_life_days FLOAT DEFAULT 7.0"))
            conn.commit()
        except Exception:
            pass
        try:
            conn.execute(text("ALTER TABLE inventory ADD COLUMN recommendation VARCHAR"))
            conn.commit()
        except Exception:
            pass

    db = SessionLocal()
    try:
        from app.models.user import User
        from app.core import security
        existing_admin = db.query(User).filter(User.username == "admin").first()
        if not existing_admin:
            admin_user = User(
                name="System Administrator",
                username="admin",
                email="admin@freshnesswatch.com",
                password_hash=security.get_password_hash("Admin123!"),
                role="Administrator",
            )
            db.add(admin_user)
            db.commit()
    except Exception as e:
        print("[DB Init Warning]", e)
    finally:
        db.close()

