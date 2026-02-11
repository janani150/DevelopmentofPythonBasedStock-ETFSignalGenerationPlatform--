from services.data_fetcher import fetch_stock_data
from services.feature_engineering import create_features

data = fetch_stock_data("RELIANCE.NS")
features_df = create_features(data)

print(features_df.tail())
print("\nColumns:")
print(features_df.columns)
