from pathlib import Path
from PIL import Image
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATASET_DIR = PROJECT_ROOT / "Freshness44"
MODEL_PATH = PROJECT_ROOT / "data" / "image_model.joblib"
VALID_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp"}


def extract_image_features(image: Image.Image, target_size=(128, 128), bins=16) -> np.ndarray:
    image = image.resize(target_size)
    image = image.convert("RGB")
    arr = np.array(image)
    features = []
    for channel in range(3):
        hist, _ = np.histogram(arr[:, :, channel], bins=bins, range=(0, 255))
        hist = hist.astype(np.float32)
        if hist.sum() > 0:
            hist /= hist.sum()
        features.extend(hist.tolist())

    mean_rgb = arr.mean(axis=(0, 1)).astype(np.float32) / 255.0
    std_rgb = arr.std(axis=(0, 1)).astype(np.float32) / 255.0
    features.extend(mean_rgb.tolist())
    features.extend(std_rgb.tolist())
    return np.array(features, dtype=np.float32)


def label_from_path(path: Path) -> str:
    folder = path.parent.name
    if "fresh" in folder.lower():
        return "fresh"
    if "rotten" in folder.lower() or "spoiled" in folder.lower():
        return "rotten"
    return "unknown"


def load_dataset(sample_limit: int | None = None) -> tuple[list[np.ndarray], list[str]]:
    if not DATASET_DIR.exists():
        raise FileNotFoundError(f"Dataset directory {DATASET_DIR} not found.")

    features = []
    labels = []
    for image_path in sorted(DATASET_DIR.rglob("*")):
        if image_path.suffix.lower() not in VALID_EXTENSIONS:
            continue
        label = label_from_path(image_path)
        if label not in {"fresh", "rotten"}:
            continue
        try:
            with Image.open(image_path) as image:
                feature_vector = extract_image_features(image)
        except Exception:
            continue
        features.append(feature_vector)
        labels.append(label)
        if sample_limit and len(features) >= sample_limit:
            break

    if not features:
        raise ValueError("No valid images found in dataset.")
    return features, labels


def train_image_model(sample_limit: int | None = None) -> None:
    features, labels = load_dataset(sample_limit=sample_limit)
    X = np.vstack(features)
    y = np.array(labels)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    classifier = RandomForestClassifier(n_estimators=150, random_state=42, n_jobs=-1)
    classifier.fit(X_train, y_train)

    if not MODEL_PATH.parent.exists():
        MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(classifier, MODEL_PATH)

    predictions = classifier.predict(X_test)
    print("Image freshness classifier trained.")
    print(classification_report(y_test, predictions, digits=4))
    print(f"Model saved to {MODEL_PATH}")


def load_image_model():
    if MODEL_PATH.exists():
        return joblib.load(MODEL_PATH)
    return None


def predict_image(image: Image.Image, model) -> tuple[str, float]:
    features = extract_image_features(image)
    probs = model.predict_proba([features])[0]
    classes = list(model.classes_)
    if "fresh" in classes:
        fresh_index = classes.index("fresh")
        score = float(probs[fresh_index])
    else:
        score = float(max(probs))
    label = model.predict([features])[0]
    return label, score
