import sys
sys.path.append('backend')
from services.predictor import predict_signal
from services.model_loader import load_models

models = load_models()
res = predict_signal("AAPL", models)
print("PREDICT_RESULT:", res)

from database import users_collection
print("DB_RECENT_SEARCHES:", list(users_collection.find({}, {'recent_searches':1})))
