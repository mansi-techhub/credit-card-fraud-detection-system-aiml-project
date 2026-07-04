from __future__ import annotations

from datetime import datetime, timedelta
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "fraud_model.pkl"
ENCODERS_PATH = BASE_DIR / "encoders.pkl"

app = Flask(__name__)
CORS(app)

model = None
artifacts = None


def load_artifacts() -> tuple[object, dict]:
    loaded_model = joblib.load(MODEL_PATH)
    loaded_artifacts = joblib.load(ENCODERS_PATH)
    return loaded_model, loaded_artifacts


def ensure_artifacts_loaded() -> None:
    global model, artifacts
    if model is None or artifacts is None:
        model, artifacts = load_artifacts()


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    radius_km = 6371.0
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = (
        np.sin(dlat / 2) ** 2
        + np.cos(lat1) * np.cos(lat2) * np.sin(dlon / 2) ** 2
    )
    c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1 - a))
    return float(radius_km * c)


def estimate_distance(payload: dict) -> float:
    explicit_distance = payload.get("distance")
    if explicit_distance not in (None, ""):
        return float(explicit_distance)

    location_keys = ["customer_lat", "customer_long", "merchant_lat", "merchant_long"]
    if all(payload.get(key) not in (None, "") for key in location_keys):
        return haversine_distance(
            float(payload["customer_lat"]),
            float(payload["customer_long"]),
            float(payload["merchant_lat"]),
            float(payload["merchant_long"]),
        )

    return 0.0


def normalize_payload(payload: dict) -> pd.DataFrame:
    transaction_time = payload.get("transaction_time")
    hour = payload.get("hour")
    if transaction_time:
        parsed_time = pd.to_datetime(transaction_time, errors="coerce")
        hour_value = int(parsed_time.hour) if pd.notna(parsed_time) else 0
    elif hour not in (None, ""):
        hour_value = int(hour)
    else:
        hour_value = 0

    age_value = payload.get("age")
    if age_value in (None, "") and payload.get("dob"):
        dob = pd.to_datetime(payload["dob"], errors="coerce")
        age_value = (
            int((datetime.now() - dob.to_pydatetime()) / timedelta(days=365.25))
            if pd.notna(dob)
            else 0
        )

    row = {
        "amt": float(payload.get("amount", 0)),
        "category": str(payload.get("category", "unknown")),
        "gender": str(payload.get("gender", "Unknown")),
        "city_pop": float(payload.get("city_pop", 0)),
        "state": str(payload.get("state", "NA")),
        "job": str(payload.get("job", "unknown")),
        "city": str(payload.get("city", "unknown")),
        "age": float(age_value or 0),
        "hour": int(hour_value),
        "distance_km": estimate_distance(payload),
    }

    return pd.DataFrame([row], columns=artifacts["feature_columns"])


def build_report(probability: float, payload: dict, features: pd.DataFrame) -> list[str]:
    report_items: list[str] = []
    amount = float(payload.get("amount", 0))
    if amount >= 2000:
        report_items.append("High transaction amount increases risk.")
    if int(features.iloc[0]["hour"]) < 5:
        report_items.append("Late-night transaction timing is unusual.")
    if float(features.iloc[0]["distance_km"]) >= 100:
        report_items.append("Large customer-to-merchant distance is suspicious.")
    if probability < 0.35:
        report_items.append("Overall model confidence suggests a low fraud pattern.")
    elif probability < 0.7:
        report_items.append("Model sees a mixed-risk pattern that should be reviewed.")
    else:
        report_items.append("Model detected a strong fraud-like pattern.")
    return report_items


@app.get("/health")
def health():
    if MODEL_PATH.exists() and ENCODERS_PATH.exists():
        ensure_artifacts_loaded()
    return jsonify(
        {
            "status": "ok",
            "model_loaded": model is not None and artifacts is not None,
            "model_version": artifacts.get("model_version") if artifacts else None,
            "training_date": artifacts.get("training_date") if artifacts else None,
        }
    )


@app.post("/predict")
def predict():
    ensure_artifacts_loaded()
    payload = request.get_json(silent=True) or {}
    features = normalize_payload(payload)
    processed = artifacts["preprocessor"].transform(features)

    fraud_probability = float(model.predict_proba(processed)[0][1])
    prediction = int(fraud_probability >= 0.5)

    return jsonify(
        {
            "prediction": prediction,
            "label": "Fraud" if prediction else "Normal",
            "fraud_probability": round(fraud_probability, 4),
            "confidence": round(max(fraud_probability, 1 - fraud_probability), 4),
            "report": build_report(fraud_probability, payload, features),
            "features_used": features.iloc[0].to_dict(),
        }
    )


if __name__ == "__main__":
    model, artifacts = load_artifacts()
    app.run(host="0.0.0.0", port=5000, debug=True)
