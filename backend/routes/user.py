from flask import Blueprint, request, jsonify
from database import users_collection

user_bp = Blueprint("user", __name__)

# ----------------------------------------
# ✅ GET /api/user
# ----------------------------------------
@user_bp.route("/", methods=["GET"])
def get_user():
    try:
        return jsonify({
            "name": "",
            "email": "",
            "apiKey": ""
        }), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ----------------------------------------
# ✅ POST /api/user  
# ----------------------------------------
@user_bp.route("/", methods=["POST"])
def update_user():
    try:
        data = request.json
        email = data.get("email")
        name = data.get("name", "")

        if email:
            users_collection.update_one(
                {"email": email},
                {"$set": {"name": name}},
                upsert=True
            )

        return jsonify({"status": "success", "message": "Saved"}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500