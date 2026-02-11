from services.data_fetcher import fetch_stock_data
from services.feature_engineering import create_features


def predict_signal(ticker, models_dict):
    """
    Generate prediction for a given ticker.
    """

    if ticker not in models_dict:
        raise ValueError(f"Model not available for {ticker}")

    model = models_dict[ticker]["model"]
    scaler = models_dict[ticker]["scaler"]
    feature_list = models_dict[ticker]["features"]

    # 1. Fetch latest data
    data = fetch_stock_data(ticker)

    # 2. Create features
    df = create_features(data)

    if df.empty:
        raise ValueError("Not enough data after feature engineering")

    # 3. Select required features
    X = df[feature_list]

    # 4. Take latest row only
    latest_row = X.iloc[[-1]]

    # 5. Scale
    latest_scaled = scaler.transform(latest_row)

    # 6. Predict
    prediction = model.predict(latest_scaled)[0]
    probabilities = model.predict_proba(latest_scaled)[0]

    # Get confidence of predicted class
    confidence = max(probabilities)

    # 7. Convert signal to text
    signal_map = {
        1: "BUY",
        0: "HOLD",
        -1: "SELL"
    }

    result = {
        "symbol": ticker,
        "signal": signal_map.get(prediction, "UNKNOWN"),
        "confidence": round(float(confidence), 2)
    }

    return result
