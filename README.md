# 🍃 AI Food Freshness Monitoring Platform

An enterprise-grade, full-stack AI platform designed for real-time food quality detection, shelf-life estimation, inventory tracking, and automated spoilage reduction.

---

## 🏛️ System Architecture

The platform is engineered using **Clean Architecture** and **SOLID principles**:

```
 ┌─────────────────────────────────────────────────────────────┐
 │                     React 19 Frontend                       │
 │      (Vite + TailwindCSS + Recharts + Framer Motion)        │
 └──────────────────────────────┬──────────────────────────────┘
                                │ REST API (Axios Interceptors)
 ┌──────────────────────────────▼──────────────────────────────┐
 │                     FastAPI Backend                         │
 │     (Clean Architecture: API -> Services -> Repositories)   │
 └──────────────┬──────────────────────────────┬───────────────┘
                │                              │
 ┌──────────────▼──────────────┐ ┌──────────────▼──────────────┐
 │ TensorFlow EfficientNetB0   │ │     PostgreSQL Database     │
 │  (8 Freshness Classes Keras) │ │  (SQLAlchemy 2.0 + Alembic)  │
 └─────────────────────────────┘ └─────────────────────────────┘
```

---

## ✨ Features

- **🤖 AI Image Classification**: Classifies food items into 8 categories (`fresh_bread`, `fresh_dairy`, `fresh_fruits`, `fresh_vegetables`, `spoiled_bread`, `spoiled_dairy`, `spoiled_fruits`, `spoiled_vegetables`).
- **⏳ Shelf-Life & Handling Engine**: Calculates remaining shelf-life days, storage advice, consumption guidelines, and safety warnings.
- **🔐 JWT Authentication**: Token pair authentication (access + refresh), Argon2 password hashing, password reset recovery, and user profile management.
- **📦 Global Perishable Inventory**: Owner-scoped inventory CRUD, expiration date tracking, and image analysis attachment.
- **📄 Document Export**: Export prediction history to **CSV**, Excel (**XLSX**), and formatted **PDF** documents.
- **📊 Real-Time Analytics**: Operations dashboard displaying live quality stats, spoilage trends, and category distribution.
- **🔔 Automated Alerts**: System notifications for items expiring within 3 days, low inventory stock, and spoiled food detection.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Python 3.12, FastAPI, Uvicorn
- **AI Core**: TensorFlow 2.16+, EfficientNetB0 Keras model
- **Database & ORM**: PostgreSQL, SQLAlchemy 2.0, Alembic
- **Security**: JWT (`PyJWT`), Argon2 (`pwdlib`)
- **Document Export**: ReportLab, openpyxl

### Frontend
- **Framework**: React 19, Vite
- **Styling**: TailwindCSS 4, Framer Motion
- **Icons & Visuals**: Lucide Icons, Recharts

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Python 3.12+
- Node.js v22+
- PostgreSQL 16+

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure environment
cp ../.env.example .env

# Run database migrations
alembic upgrade head

# Run development server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The web application will be available at `http://localhost:5173`.

---

## 🐳 Production Deployment (Docker Compose)

Launch the complete stack (PostgreSQL database + FastAPI backend) using Docker Compose:

```bash
# Clone repository and start containers
docker-compose up -d --build
```

- **API Base URL**: `http://localhost:8000`
- **Swagger API Docs**: `http://localhost:8000/docs`
- **ReDoc Documentation**: `http://localhost:8000/redoc`

---

## 🧪 Running Automated Tests

Run the backend pytest unit and integration test suite:

```bash
cd backend
PYTHONPATH=. ./venv/bin/pytest
```

---

## 📑 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register a new user account |
| `POST` | `/api/v1/auth/login` | Authenticate user & issue tokens |
| `POST` | `/api/v1/auth/refresh` | Rotate access token using refresh token |
| `POST` | `/api/v1/auth/forgot-password` | Request password reset token |
| `POST` | `/api/v1/auth/reset-password` | Reset account password |
| `PATCH` | `/api/v1/auth/me` | Update current user profile |
| `POST` | `/api/v1/auth/change-password` | Change user password |
| `POST` | `/api/v1/predict` | Predict food freshness from uploaded image |
| `GET` | `/api/v1/inventory` | List owner inventory items (search, filter, paginate) |
| `POST` | `/api/v1/inventory` | Create a new inventory item |
| `GET` | `/api/v1/prediction-history` | Audit log of past predictions |
| `GET` | `/api/v1/analytics/overview` | Dynamic analytics aggregates |
| `GET` | `/api/v1/reports/prediction-history` | Download prediction history (CSV, XLSX, PDF) |
| `GET` | `/api/v1/notifications` | List user notification alerts |
