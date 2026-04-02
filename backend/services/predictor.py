from services.data_fetcher import fetch_stock_data
from services.feature_engineering import create_features


def predict_signal(ticker, models_dict):
    """
    Generate prediction for a given ticker using the generic global model.
    """

    if "global" not in models_dict:
        raise ValueError("Global model not loaded. Please run train_global_model.py first.")

    model = models_dict["global"]["model"]
    scaler = models_dict["global"]["scaler"]
    feature_list = models_dict["global"]["features"]

    # 1. Fetch longer history to allow richer features and smoothing
    # Use ~300 days to cover ~1 year of trading days (adjustable)
    try:
        data = fetch_stock_data(ticker, period="300d")
    except ValueError as ve:
        # Propagate user-friendly fetch errors (e.g., no data found)
        raise

    # Grab the current market price before feature engineering removes rows/columns
    current_price = data['Close'].iloc[-1]
    prev_close = data['Close'].iloc[-2] if len(data) > 1 else current_price
    change_percent = ((current_price - prev_close) / prev_close) * 100 if prev_close else 0.0
    
    # Convert price to INR if it is in another currency like USD
    try:
        import yfinance as yf
        info = yf.Ticker(ticker).info
        currency = info.get('currency', 'USD')
        
        if currency and currency != 'INR':
            rate_ticker = f"{currency}INR=X"
            rate_data = yf.Ticker(rate_ticker).history(period="1d")
            if not rate_data.empty:
                exchange_rate = rate_data['Close'].iloc[-1]
                current_price = current_price * exchange_rate
            else:
                current_price = current_price * 83.5 # Fallback static rate
    except Exception as e:
        print(f"Currency conversion failed: {e}")
        # Simple heuristic fallback
        if current_price < 1000 and '.' not in ticker: 
            current_price = current_price * 83.5

    # 2. Create features
    df = create_features(data)

    if df.empty:
        raise ValueError("Not enough data after feature engineering")

    # 3. Select required features
    X = df[feature_list]

    # 4. Use recent rows and smooth probabilities over the last N rows
    SMOOTH_WINDOW = 3
    recent_rows = X.iloc[-SMOOTH_WINDOW:] if len(X) >= SMOOTH_WINDOW else X

    # 5. Scale the recent rows
    recent_scaled = scaler.transform(recent_rows)

    # 6. Predict probabilities for each recent row and average them
    probas = model.predict_proba(recent_scaled)  # shape (k, n_classes)
    mean_proba = probas.mean(axis=0)

    # Determine predicted class using model.classes_
    pred_idx = int(mean_proba.argmax())
    pred_label = int(model.classes_[pred_idx])

    # Confidence is the averaged probability for the chosen class
    confidence = float(mean_proba[pred_idx])

    # 7. Convert signal to text with confidence-based filtering
    # 2: BUY, 1: HOLD, 0: SELL (from our XGBoost training script)
    signal_map = {
        2: "BUY",
        1: "HOLD",
        0: "SELL"
    }

    base_signal = signal_map.get(pred_label, "UNKNOWN")

    # Simplified decision rule per user request:
    # - Keep base_signal as the original model prediction (BUY/SELL)
    # - Only return BUY, SELL, or HOLD
    # - If confidence >= 0.4 -> use base_signal, else -> HOLD
    THRESHOLD = 0.4

    if confidence >= THRESHOLD:
        signal = base_signal
    else:
        signal = "HOLD"

    result = {
        "symbol": ticker,
        "signal": signal,
        "base_signal": base_signal,
        "confidence": round(confidence, 2),
        "price": round(float(current_price), 2),
        "latest_price": round(float(current_price), 2),
        "change_percent": round(float(change_percent), 2)
    }

    return result
