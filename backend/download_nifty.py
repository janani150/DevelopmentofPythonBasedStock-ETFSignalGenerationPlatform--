import urllib.request
import json
import pandas as pd
import io

try:
    print("Downloading Nifty 500 data from raw github repository...")
    url = 'https://raw.githubusercontent.com/justinmchou/nifty500/main/nifty500.csv'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    response = urllib.request.urlopen(req)
    csv_data = response.read()
    df = pd.read_csv(io.BytesIO(csv_data))
    
    sym_col = None
    for col in df.columns:
        if 'symbol' in col.lower():
            sym_col = col
            break
            
    if sym_col:
        tickers = df[sym_col].astype(str) + '.NS'
        tickers_list = tickers.tolist()
        
        with open('nifty500_cache.json', 'w') as f:
            json.dump(tickers_list, f)
        print('SUCCESS:', len(tickers_list), 'stocks cached')
    else:
        print('Failed to find symbol column in CSV.')
except Exception as e:
    print('Failed to download or parse CSV:', e)
