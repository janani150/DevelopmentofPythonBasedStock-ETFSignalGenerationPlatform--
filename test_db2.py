import sys
sys.path.append('backend')
from database import users_collection
import json

data = list(users_collection.find({}, {'recent_searches':1, '_id': 0}))
with open('db_out.json', 'w') as f:
    json.dump(data, f)
