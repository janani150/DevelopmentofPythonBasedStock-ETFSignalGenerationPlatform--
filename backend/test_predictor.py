from services.model_loader import load_models
from services.predictor import predict_signal

models = load_models()

result = predict_signal("RELIANCE.NS", models)

print(result)
