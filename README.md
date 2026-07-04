# Credit Card Fraud Detector

This project trains a machine learning model on the Kartik Shenoy credit card fraud dataset and serves predictions through a Flask API with a React frontend.

## Project Structure

- `backend/train_model.py`: loads the dataset, creates derived features, trains an XGBoost model, and saves artifacts
- `backend/app.py`: Flask API that exposes `/predict`
- `frontend/`: Vite + React app for entering transaction details and viewing the fraud report

## Dataset

Place the Kaggle CSV file inside `backend/dataset/`.

Expected dataset columns include:

- `trans_date_trans_time`
- `merchant`
- `category`
- `amt`
- `gender`
- `city`
- `state`
- `city_pop`
- `job`
- `dob`
- `lat`
- `long`
- `merch_lat`
- `merch_long`
- `is_fraud`

## Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python train_model.py
python app.py
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and sends prediction requests to `http://localhost:5000/predict`.
