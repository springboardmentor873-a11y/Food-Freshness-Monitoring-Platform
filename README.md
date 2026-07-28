#  AI Food Freshness Monitoring Platform

An AI-powered full-stack web application designed to evaluate food freshness, forecast remaining shelf life, detect visual spoilage indicators, and track inventory to reduce food waste.

Powered by a **ResNet-50 Deep Learning Model** (`model.keras`), a **Python Flask REST API**, and a modern **React + Vite** glassmorphism interface.

---

## Key Features

- ** AI Image Classification Workspace**:
  - Drag-and-drop food image upload, webcam capture, or 1-click test sample selection.
  - Live animated laser scan line overlay during inference.
  - Classifies food into 4 freshness categories: **Fresh (Good to Eat)**, **Good / Eat Soon**, **Near Spoilage**, and **Spoiled (Do Not Eat)**.

- ** Visual Degradation & Feature Analysis**:
  - Breakdown of **Color Degradation %**, **Texture Degradation Score**, **Mold & Spoilage Probability**, and **Surface Damage / Bruising Index**.

- ** Dynamic Shelf-Life Forecasting**:
  - Calculates exact remaining shelf life in days and hours.
  - Provides customized storage and consumption recommendations.

- ** Environmental Condition Simulator**:
  - Interactive sliders for storage temperature (0°C to 30°C) and relative humidity (30% to 95%).
  - Shows real-time decay impact based on ambient conditions versus refrigeration.

- ** Active Pantry & Fridge Inventory Tracker**:
  - Add scanned items to inventory with expiration countdown timers and status alerts.
  - Filter items by fresh, warning, or expired states.

- ** Waste Reduction & Financial Analytics**:
  - Real-time statistics on total food items scanned, food waste saved in kg, and estimated cost savings in USD.

---

## Tech Stack

- **Backend**: Python 3.12, Flask, Flask-CORS, TensorFlow 2.21, Keras 3, Pillow, NumPy
- **Frontend**: React 18, Vite 5, Modern Vanilla CSS (Glassmorphism, Dark Mode, Animations), Lucide React Icons
- **Machine Learning Model**: ResNet-50 Architecture (`best_resnet_model.keras`, 224x224 RGB input)

---

##  Repository Structure

```
food-freshness-monitoring/
├── backend/
│   ├── app.py                 # Main Flask REST API server
│   ├── model_service.py       # Keras ResNet model loader & inference engine
│   ├── freshness_engine.py    # Visual feature extraction & shelf-life calculator
│   ├── inventory_store.py     # In-memory inventory & analytics manager
│   ├── requirements.txt       # Python backend dependencies
│   └── samples/               # Preset sample images for 1-click testing
├── frontend/
│   ├── src/
│   │   ├── components/        # React UI components (Scanner, Result, Inventory, Sim, Analytics)
│   │   ├── index.css          # CSS design system & glassmorphism theme
│   │   ├── App.jsx            # Main app assembly
│   │   └── main.jsx           # Entry point
│   ├── package.json           # Frontend npm dependencies
│   └── vite.config.js         # Vite build configuration
├── best_resnet_model.keras    # Pre-trained ResNet Keras model file (renamed to model.keras)
├── model.keras                # Active ResNet Keras model file
├── .gitignore                 # Git ignore settings
└── README.md                  # Project documentation
```

---

##  Getting Started

### Prerequisites
- **Python**: Python 3.10+ installed
- **Node.js**: Node.js 18+ and `npm` installed

---

### 1️ Setup & Run Backend (Flask API)

```bash
# Navigate to project root
cd food-freshness-monitoring

# Install backend dependencies
pip install -r backend/requirements.txt

# Run the Flask backend server
python backend/app.py
```
> The API server will start at `http://localhost:5000`

---

### 2️ Setup & Run Frontend (React + Vite)

Open a second terminal window:

```bash
# Navigate to frontend folder
cd food-freshness-monitoring/frontend

# Install frontend dependencies
npm install

# Start the Vite development server
npm run dev
```
> The web application will launch at `http://localhost:5173`

---
