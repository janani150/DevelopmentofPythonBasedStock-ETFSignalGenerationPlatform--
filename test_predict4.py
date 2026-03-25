import sys
import json
sys.path.append('backend')
from services.predictor import predict_signal
from services.model_loader import load_models

models = load_models()
res = predict_signal('AAPL', models)

with open('res_out.json', 'w') as f:
    json.dump(res, f)
