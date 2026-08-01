from pathlib import Path
from fastapi import APIRouter, File, UploadFile, Depends, HTTPException
from app.security import get_current_user
from app.models import User
from app.ml.train import train_model
from app.ml.image_model import train_image_model, DATASET_DIR, MODEL_PATH as IMAGE_MODEL_PATH

router = APIRouter()
DATA_FILE = Path("data/freshness_labels.csv")
MODEL_FILE = Path("data/model.joblib")


def ensure_privileged_user(user: User):
    if user.role not in ["retail_manager", "manager", "analyst"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions for dataset operations")


@router.post("/upload")
def upload_dataset(file: UploadFile = File(...), user: User = Depends(get_current_user)):
    ensure_privileged_user(user)
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    try:
        content = file.file.read()
        DATA_FILE.write_bytes(content)
        return {"message": "Dataset uploaded successfully.", "filename": DATA_FILE.name}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.post("/train")
def train_dataset(user: User = Depends(get_current_user)):
    ensure_privileged_user(user)
    try:
        train_model()
        return {"message": "Shelf-life model trained successfully.", "model_path": str(MODEL_FILE)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/status")
def dataset_status(user: User = Depends(get_current_user)):
    return {
        "dataset_exists": DATA_FILE.exists(),
        "model_exists": MODEL_FILE.exists(),
        "dataset_path": str(DATA_FILE),
        "model_path": str(MODEL_FILE),
        "allowed_upload_roles": ["manager", "retail_manager", "analyst"],
    }


@router.post("/image/train")
def train_image_dataset(user: User = Depends(get_current_user)):
    ensure_privileged_user(user)
    try:
        train_image_model()
        return {
            "message": "Image freshness model trained successfully.",
            "dataset_path": str(DATASET_DIR),
            "model_path": str(IMAGE_MODEL_PATH),
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/image/status")
def image_dataset_status(user: User = Depends(get_current_user)):
    return {
        "dataset_exists": DATASET_DIR.exists(),
        "dataset_path": str(DATASET_DIR),
        "model_exists": IMAGE_MODEL_PATH.exists(),
        "model_path": str(IMAGE_MODEL_PATH),
    }
