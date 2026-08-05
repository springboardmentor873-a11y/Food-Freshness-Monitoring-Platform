# Food Freshness Monitoring Platform

This repository contains the **Food Freshness Monitoring Platform**, an
AI-powered web application developed as part of the **Infosys
Springboard Internship Project**. The platform uses **Deep Learning
(EfficientNetB0)** to classify food items as **Fresh** or **Spoiled**
from uploaded images. It also provides an interactive dashboard for
monitoring food freshness, managing inventory, viewing analytics, and
improving food quality management.

The project combines a **React + Vite frontend**, a **FastAPI backend**,
and a **TensorFlow/Keras** deep learning model to deliver real-time food
freshness predictions through an intuitive and responsive user
interface.

------------------------------------------------------------------------

# Tech Stack

## Frontend

-   React 18
-   Vite
-   Tailwind CSS
-   React Router DOM
-   Framer Motion
-   Lucide React
-   Recharts
-   React Hook Form
-   React Hot Toast

## Backend

-   FastAPI
-   Python
-   Uvicorn

## AI & Machine Learning

-   TensorFlow
-   Keras
-   EfficientNetB0 (Transfer Learning)
-   OpenCV
-   NumPy

------------------------------------------------------------------------

# Getting Started
## Frontend

``` bash
npm install
npm run dev
```

## Backend

``` bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8001
```

Backend: http://127.0.0.1:8001

------------------------------------------------------------------------

# Authentication

-   User Login
-   User Registration

------------------------------------------------------------------------

# Project Structure

``` text
Food-Freshness-Monitoring-Platform/
├── frontend/
├── backend/
├── README.md
└── .gitignore
```

------------------------------------------------------------------------

# Features

-   Modern Landing Page
-   User Authentication
-   Dashboard
-   Food Image Upload
-   AI-Based Food Freshness Prediction
-   Confidence Score Display
-   Inventory Management
-   Search & Filter
-   Analytics Dashboard
-   Notifications
-   Settings
-   Responsive UI

------------------------------------------------------------------------

# AI Model

-   EfficientNetB0
-   TensorFlow/Keras Transfer Learning
-   Image Size: 224 × 224

Classes: - Fresh Bread - Fresh Dairy - Fresh Fruits - Fresh Vegetables -
Spoiled Bread - Spoiled Dairy - Spoiled Fruits - Spoiled Vegetables

------------------------------------------------------------------------

# Project Notes

-   React frontend connected to a FastAPI backend.
-   EfficientNetB0 model performs food freshness classification.
-   Modular architecture for future scalability.

------------------------------------------------------------------------

# Future Enhancements

-   Improve model accuracy
-   Barcode scanning
-   Real-time notifications
-   Docker deployment
-   Cloud deployment
-   JWT Authentication
-   Database integration

------------------------------------------------------------------------

# Screenshots

-   Landing Page
-   Login
-   Dashboard
-   Food Analysis
-   Prediction Results
-   Inventory
-   Analytics
-   Settings

------------------------------------------------------------------------

# Developer

**Sharaff Safiya**

Final Year B.Tech -- Computer Science & Engineering

Developed as part of the **Infosys Springboard Internship Project**.
