# 🍎 Food Freshness Monitoring Platform

An AI-powered computer vision platform designed to analyze food quality, detect spoilage indicators, estimate remaining shelf-life, and provide intelligent storage and consumption recommendations.

---

## 📌 Executive Project Summary

### 🎯 Core Objectives
- **Automated Freshness Classification**: Detect whether fruits and vegetables are **Fresh** or **Rotten** using deep learning / computer vision.
- **Shelf-Life & Storage Intelligence**: Estimate remaining shelf life and provide storage guidelines (e.g., refrigeration temperature, moisture control).
- **Risk Assessment**: Assign risk levels (*Low Risk* vs *High Risk*) to help consumers and retailers prevent food spoilage.
- **PDF Report Generation**: Download shareable AI inspection reports instantly.

---

## 🛠️ Technology Stack

- **Backend**: Python 3.13, FastAPI, Uvicorn, TensorFlow, ResNet50, Pillow, NumPy
- **Frontend**: React 19, Vite, Bootstrap 5, Axios, jsPDF, React Icons
- **Deployment & Tooling**: Git, PowerShell, npm

---

## 🚀 Running the Application Locally

### 1. Backend Server (FastAPI)
```powershell
cd backend
& "C:\Users\chama\anaconda3\python.exe" -m uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Frontend Application (Vite + React)
```powershell
cd frontend
npm run dev
```

---

## 🔗 Live Local Links

- **React Frontend**: [http://127.0.0.1:5173](http://127.0.0.1:5173)
- **Backend API Base**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Health Check Endpoint**: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)
- **Interactive Swagger Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc API Documentation**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 🍇 Supported Food Categories (37 Classes)

The system supports freshness classification for 18 primary fruits and vegetables in both **Fresh** and **Rotten** states:

1. **Apple** (*Fresh / Rotten*)
2. **Banana** (*Fresh / Rotten*)
3. **Bellpepper** (*Fresh / Rotten*)
4. **Bitter Gourd** (*Fresh / Rotten*)
5. **Carrot** (*Fresh / Rotten*)
6. **Cucumber** (*Fresh / Rotten*)
7. **Grapes** (*Fresh / Rotten*)
8. **Guava** (*Fresh / Rotten*)
9. **Jujube** (*Fresh / Rotten*)
10. **Kaki** (*Fresh / Rotten*)
11. **Lime** (*Fresh / Rotten*)
12. **Mango** (*Fresh / Rotten*)
13. **Orange** (*Fresh / Rotten*)
14. **Pomegranate** (*Fresh / Rotten*)
15. **Potato** (*Fresh / Rotten*)
16. **Strawberry** (*Fresh / Rotten*)
17. **Tomato** (*Fresh / Rotten*)
18. **Watermelon** (*Fresh / Rotten*)

---

## 📤 How to Upload to GitHub

1. Create a new repository on [GitHub](https://github.com/new).
2. Run the following commands in PowerShell inside the root folder:

```powershell
# Initialize repository
git init

# Add files & commit
git add .
git commit -m "Initial commit - Food Freshness Monitoring Platform"

# Link to GitHub and Push
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```
