from database import users_collection

def get_user_data(email: str):
    try:
        user = users_collection.find_one({"email": email})
        if not user:
            return {"name": "", "email": email}
        return {
            "name": user.get("name", ""),
            "email": user.get("email", email)
        }
    except Exception as e:
        return {"name": "", "email": email}


def save_user_data(email: str, name: str):
    try:
        users_collection.update_one(
            {"email": email},
            {"$set": {"name": name, "email": email}},
            upsert=True
        )
        return True
    except Exception as e:
        return False