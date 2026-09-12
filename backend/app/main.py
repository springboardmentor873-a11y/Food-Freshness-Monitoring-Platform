from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine, init_db
from app.routers import admin, analysis, analytics, auth, freshness, inventory, notifications, system

# Initialize SQLite database tables & seed initial data automatically on startup
init_db()

app = FastAPI(
    title="Freshness Watch API",
    description="Real-time Food Freshness Monitoring API powered by Keras ML & SQLite",
    version="1.0.0",
)

# Enable CORS for React/Vite development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth.router)
app.include_router(freshness.router)
app.include_router(analysis.router)
app.include_router(inventory.router)
app.include_router(notifications.router)
app.include_router(analytics.router)
app.include_router(admin.router)
app.include_router(system.router)



@app.get("/")
def root():
    return {
        "status": "online",
        "message": "Freshness Watch API Gateway operational",
        "docs": "/docs",
    }