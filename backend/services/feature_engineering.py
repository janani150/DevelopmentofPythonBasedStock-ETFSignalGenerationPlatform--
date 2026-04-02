import numpy as np
import pandas as pd


def create_features(data):
    """
    Create technical indicators exactly as used during training.
    Returns processed DataFrame.
    """

    df = data.copy()

    # 1. Daily Return
    df['Return'] = df['Close'].pct_change()

    # 2. Moving Averages
    df['MA20'] = df['Close'].rolling(20).mean()
    df['MA50'] = df['Close'].rolling(50).mean()

    # 3. Volatility (20-day rolling std of returns)
    df['Volatility'] = df['Return'].rolling(20).std()

    # 4. Volume Change
    df['Volume_Change'] = df['Volume'].pct_change()

    # 5. Exponential Moving Averages
    df['EMA12'] = df['Close'].ewm(span=12, adjust=False).mean()
    df['EMA26'] = df['Close'].ewm(span=26, adjust=False).mean()

    # 6. MACD (12,26) and signal (9)
    df['MACD'] = df['EMA12'] - df['EMA26']
    df['MACD_Signal'] = df['MACD'].ewm(span=9, adjust=False).mean()
    df['MACD_Hist'] = df['MACD'] - df['MACD_Signal']

    # 5. RSI (14-day)
    delta = df['Close'].diff()
    gain = delta.clip(lower=0)
    loss = -delta.clip(upper=0)

    avg_gain = gain.rolling(14).mean()
    avg_loss = loss.rolling(14).mean()

    rs = avg_gain / avg_loss
    df['RSI'] = 100 - (100 / (1 + rs))

    # 6. Moving Average Crossover
    df['MA_Cross'] = (df['MA20'] > df['MA50']).astype(int)

    # 7. Bollinger Bands (20, 2)
    df['BB_MID'] = df['MA20']
    df['BB_STD'] = df['Close'].rolling(20).std()
    df['BB_UPPER'] = df['BB_MID'] + 2 * df['BB_STD']
    df['BB_LOWER'] = df['BB_MID'] - 2 * df['BB_STD']

    # 8. On-Balance Volume (OBV)
    obv = [0]
    for i in range(1, len(df)):
        if df['Close'].iat[i] > df['Close'].iat[i-1]:
            obv.append(obv[-1] + df['Volume'].iat[i])
        elif df['Close'].iat[i] < df['Close'].iat[i-1]:
            obv.append(obv[-1] - df['Volume'].iat[i])
        else:
            obv.append(obv[-1])
    df['OBV'] = obv

    # 9. Momentum (close relative to MA)
    df['Momentum_20'] = df['Close'] / df['MA20'] - 1

    # Drop NaN values
    df = df.dropna()

    return df
