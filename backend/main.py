import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from datetime import datetime, timedelta
from .database import engine, Base, SessionLocal
from .models import User, InventoryItem, StorageLog, Notification
from .auth import get_password_hash
from .routes import auth, inventory, analysis, storage, notifications, reports

# 1. Initialize Database Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Food Freshness Monitoring Platform API",
    description="Backend API for image-based food freshness classification and storage optimization.",
    version="1.0.0"
)

# 2. CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Mount Static Uploads Folder
UPLOAD_DIR = r"d:\foodfreshness\backend\uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# 4. Include Routers
app.include_router(auth.router)
app.include_router(inventory.router)
app.include_router(analysis.router)
app.include_router(storage.router)
app.include_router(notifications.router)
app.include_router(reports.router)

# 5. Database Seeding Logic on Startup
@app.on_event("startup")
def seed_data():
    db = SessionLocal()
    try:
        # Check if users exist, if not, seed roles and items
        user_count = db.query(User).count()
        if user_count == 0:
            print("[Seed Info] Seeding default users...")
            roles = {
                "admin": "Admin",
                "consumer": "Consumer",
                "retail": "Retail Manager",
                "warehouse": "Warehouse Operator",
                "inspector": "Food Quality Inspector"
            }
            for username, role in roles.items():
                db_user = User(
                    username=username,
                    email=f"{username}@foodfreshness.com",
                    hashed_password=get_password_hash(f"{username}123"),
                    role=role
                )
                db.add(db_user)
            db.commit()
            
        # Seed initial storage logs if empty
        log_count = db.query(StorageLog).count()
        if log_count == 0:
            print("[Seed Info] Seeding default storage logs...")
            # We seed a log with slightly high temperature to showcase compliance alerts!
            db_log = StorageLog(
                temperature=6.5,
                humidity=82.0,
                air_circulation="Fair",
                light_exposure="Medium",
                logged_at=datetime.utcnow()
            )
            db.add(db_log)
            db.commit()
            
        # Seed initial inventory items if empty
        item_count = db.query(InventoryItem).count()
        if item_count == 0:
            print("[Seed Info] Seeding default inventory items...")
            now = datetime.utcnow()
            items = [
                {
                    "name": "Organic Gala Apples",
                    "category": "Fruits",
                    "batch_number": "BAT-APP-001",
                    "quantity": 150.0,
                    "registered_at": now - timedelta(days=3),
                    "expiry_date": now + timedelta(days=10),
                    "storage_temp": 4.0,
                    "humidity": 90.0,
                    "packaging_type": "Loose"
                },
                {
                    "name": "Fresh Baby Spinach",
                    "category": "Vegetables",
                    "batch_number": "BAT-SPN-005",
                    "quantity": 80.0,
                    "registered_at": now - timedelta(days=1),
                    "expiry_date": now + timedelta(days=5),
                    "storage_temp": 5.0,
                    "humidity": 92.0,
                    "packaging_type": "Plastic Wrap"
                },
                {
                    "name": "Whole Milk Gallon",
                    "category": "Dairy Products",
                    "batch_number": "BAT-MLK-122",
                    "quantity": 40.0,
                    "registered_at": now - timedelta(days=4),
                    "expiry_date": now + timedelta(days=6),
                    "storage_temp": 3.0,
                    "humidity": 85.0,
                    "packaging_type": "Box"
                },
                {
                    "name": "Fresh Atlantic Salmon",
                    "category": "Seafood",
                    "batch_number": "BAT-SLM-404",
                    "quantity": 25.0,
                    "registered_at": now - timedelta(days=2),
                    "expiry_date": now + timedelta(days=2),
                    "storage_temp": -0.5,
                    "humidity": 90.0,
                    "packaging_type": "Vacuum"
                }
            ]
            for item in items:
                db_item = InventoryItem(
                    name=item["name"],
                    category=item["category"],
                    batch_number=item["batch_number"],
                    quantity=item["quantity"],
                    registered_at=item["registered_at"],
                    expiry_date=item["expiry_date"],
                    storage_temp=item["storage_temp"],
                    humidity=item["humidity"],
                    packaging_type=item["packaging_type"],
                    current_status="Fresh"
                )
                db.add(db_item)
            db.commit()
            
            # Seed standard alert
            db_notif = Notification(
                title="System Seeding Completed",
                message="Sample users, storage sensors, and inventory logs successfully loaded into database.",
                type="Platform"
            )
            db.add(db_notif)
            db.commit()
            
    except Exception as e:
        print("[Seed Error] Failed to seed database:", e)
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to Food Freshness Monitoring Platform API. Go to /docs for Swagger UI."}
