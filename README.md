# Food Freshness Monitoring Platform

An AI-powered food freshness monitoring platform built with FastAPI.

## Features

- User authentication with JWT
- Food inventory management
- Image-based freshness analysis
- Shelf-life prediction
- Storage condition monitoring
- Recommendation engine
- Dashboard and REST API
- Dataset integration for model training

## Getting Started

1. Create a virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Install dependencies:

```powershell
pip install -r requirements.txt
```

3. Run the application:

```powershell
uvicorn app.main:app --reload
```

4. Open `http://127.0.0.1:8000` in your browser.

## Dataset Folder

This project supports two dataset workflows:

1. `Freshness44/` — a labeled image dataset of fresh/rotten produce used to train the image freshness classifier.
2. `data/freshness_labels.csv` — a structured dataset for shelf-life prediction.

If you have the `Freshness44/` folder, train the image classifier with:

```powershell
python -m app.ml.train_image
```

If you also have `data/freshness_labels.csv`, train or retrain the shelf-life model with:

```powershell
python -m app.ml.train
```

The app automatically falls back to heuristic shelf-life estimation when no `data/model.joblib` exists.

## API Endpoints

- `GET /` - Dashboard page
- `POST /api/login` - Authenticate user
- `GET /api/items` - List inventory items
- `POST /api/items` - Add a new inventory item
- `POST /api/assess` - Analyze uploaded food image
- `POST /api/predict` - Estimate shelf life
- `POST /api/recommend` - Generate storage and consumption recommendations
- `GET /api/dashboard/summary` - Get inventory and dataset summary (JWT required)
- `POST /api/dataset/upload` - Upload shelf-life CSV dataset (JWT required)
- `POST /api/dataset/train` - Train shelf-life regression model (JWT required)
- `GET /api/dataset/status` - Check dataset and model status (JWT required)

## UI Pages

- `GET /` - Public landing page and image/prediction tools
- `GET /dashboard.html` - Inventory CRUD and dataset management dashboard

## Testing

```powershell
pytest
```
