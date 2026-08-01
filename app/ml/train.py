import pandas as pd
from pathlib import Path
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
import joblib

DATA_PATH = Path("data/freshness_labels.csv")
MODEL_PATH = Path("data/model.joblib")


def train_model():
    if not DATA_PATH.exists():
        raise FileNotFoundError("Dataset file data/freshness_labels.csv not found.")

    df = pd.read_csv(DATA_PATH)
    if df.empty:
        raise ValueError("Dataset is empty")

    df = df.dropna(subset=["age_days", "temperature", "humidity", "category", "shelf_life_days"])

    X = df[["age_days", "temperature", "humidity", "category"]]
    y = df["shelf_life_days"]

    numeric_features = ["age_days", "temperature", "humidity"]
    categorical_features = ["category"]

    numeric_transformer = Pipeline(steps=[("scaler", StandardScaler())])
    categorical_transformer = Pipeline(steps=[("onehot", OneHotEncoder(handle_unknown="ignore"))])

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_transformer, numeric_features),
            ("cat", categorical_transformer, categorical_features),
        ]
    )

    model = Pipeline(steps=[("preprocessor", preprocessor), ("regressor", RandomForestRegressor(n_estimators=100, random_state=42))])

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model.fit(X_train, y_train)

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    print(f"Trained model saved to {MODEL_PATH}")


if __name__ == "__main__":
    train_model()
