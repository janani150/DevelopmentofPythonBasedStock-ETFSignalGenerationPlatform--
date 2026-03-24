import urllib.request
import json

url = "https://raw.githubusercontent.com/justinmchou/nifty500/main/nifty500.csv"
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    response = urllib.request.urlopen(req, timeout=10)
    data = response.read().decode('utf-8')
    lines = data.split('\n')
    
    # Simple CSV parse assuming symbol is the second column (or just search for .NS)
    # Actually, a nifty500 csv usually has standard columns. Let's just find the column named 'Symbol'
    headers = lines[0].strip().split(',')
    
    sym_idx = -1
    for i, h in enumerate(headers):
        if 'symbol' in h.lower():
            sym_idx = i
            break
            
    if sym_idx != -1:
        tickers = []
        for line in lines[1:]:
            parts = line.split(',')
            if len(parts) > sym_idx:
                sym = parts[sym_idx].strip()
                if sym:
                    tickers.append(sym + ".NS")
        
        with open("nifty500_cache.json", "w") as f:
            json.dump(tickers, f)
        print("SUCCESS_500_STOCKS", len(tickers))
    else:
        print("FAIL_NO_SYMBOL_COL")
except Exception as e:
    print("FATAL_FAIL", str(e))
