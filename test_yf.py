import yfinance as yf
data = yf.Ticker('AAPL').history(period='5d')
print("AAPL Close prices:")
print(data['Close'].tolist())
