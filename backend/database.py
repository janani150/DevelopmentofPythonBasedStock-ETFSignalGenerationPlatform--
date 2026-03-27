import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# Prefer explicit environment variable usage; fallback to localhost for local dev only
MONGO_URI = os.environ.get("MONGO_URI")
if not MONGO_URI:
    print("WARNING: MONGO_URI not set in environment variables. Falling back to localhost (dev only).")
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")

# Create client
client = MongoClient(MONGO_URI)

# Get the default database or create 'signal_platform' if none is defined in the URI
db = client.get_database("signal_platform")

# Collections
users_collection = db["users"]
alerts_collection = db["alerts"]
# Add this line to your existing database.py
notifications_collection = db["notifications"]
