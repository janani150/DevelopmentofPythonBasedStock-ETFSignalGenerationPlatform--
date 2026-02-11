from services.data_fetcher import fetch_stock_data

data = fetch_stock_data("RELIANCE.NS")

print(data.tail())
print("\nRows fetched:", len(data))
