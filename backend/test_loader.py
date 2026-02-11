from services.model_loader import load_models

models = load_models()

print("\nAvailable models:")
print(models.keys())
