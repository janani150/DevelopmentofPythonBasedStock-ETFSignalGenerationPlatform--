from flask import Blueprint, request, jsonify
from database import alerts_collection, notifications_collection
from bson.objectid import ObjectId
from datetime import datetime
import threading
import time
import yfinance as yf

alerts_bp = Blueprint('alerts', __name__)

# ----------------------------------------
# ✅ Background alert checker thread
# ----------------------------------------
def check_alerts():
    while True:
        try:
            active_alerts = list(alerts_collection.find({"status": "active"}))
            print(f"🔍 Checking {len(active_alerts)} active alerts...")

            for alert in active_alerts:
                symbol = alert.get("symbol", "")
                condition = alert.get("condition", "")
                target = float(alert.get("value", 0))
                email = alert.get("user_email", "")

                try:
                    ticker = yf.Ticker(symbol + ".NS" if not symbol.endswith(".NS") else symbol)
                    hist = ticker.history(period="1d", interval="1m")
                    if hist.empty:
                        # Try without .NS (for US stocks like AAPL)
                        ticker = yf.Ticker(symbol)
                        hist = ticker.history(period="1d", interval="1m")

                    if hist.empty:
                        continue

                    live_price = float(hist["Close"].iloc[-1])
                    print(f"  {symbol}: live={live_price}, target={target}, condition={condition}")

                    triggered = False

                    if condition == "price_above" and live_price >= target:
                        triggered = True
                    elif condition == "price_below" and live_price <= target:
                        triggered = True
                    elif condition == "rsi_above":
                        rsi = calculate_rsi(hist["Close"])
                        if rsi and rsi >= target:
                            triggered = True
                    elif condition == "rsi_below":
                        rsi = calculate_rsi(hist["Close"])
                        if rsi and rsi <= target:
                            triggered = True

                    if triggered:
                        print(f"🔔 ALERT TRIGGERED: {symbol} at {live_price}")

                        # ✅ Save notification to DB
                        notifications_collection.insert_one({
                            "user_email": email,
                            "symbol": symbol,
                            "condition": condition,
                            "target": target,
                            "live_price": live_price,
                            "message": f"{symbol} hit your target of {target} (now {round(live_price, 2)})",
                            "read": False,
                            "triggeredAt": datetime.now().strftime("%Y-%m-%d %H:%M")
                        })

                        # ✅ Mark alert as triggered
                        alerts_collection.update_one(
                            {"_id": alert["_id"]},
                            {"$set": {"status": "triggered"}}
                        )

                except Exception as e:
                    print(f"  ❌ Error checking {symbol}: {e}")

        except Exception as e:
            print(f"❌ check_alerts error: {e}")

        time.sleep(30)  # check every 30 seconds


def calculate_rsi(prices, period=14):
    try:
        delta = prices.diff()
        gain = delta.where(delta > 0, 0).rolling(period).mean()
        loss = -delta.where(delta < 0, 0).rolling(period).mean()
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        return float(rsi.iloc[-1])
    except:
        return None


# ✅ Start background thread once
checker_thread = threading.Thread(target=check_alerts, daemon=True)
checker_thread.start()
print("✅ Alert checker thread started")


# ----------------------------------------
# ✅ Get alerts for a user
# ----------------------------------------
@alerts_bp.route("/<email>", methods=["GET"])
def get_alerts(email):
    try:
        alerts = []
        for alert in alerts_collection.find({"user_email": email}):
            alert["_id"] = str(alert["_id"])
            alerts.append(alert)
        return jsonify({"status": "success", "alerts": alerts}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ----------------------------------------
# ✅ Get notifications for a user
# ----------------------------------------
@alerts_bp.route("/notifications/<email>", methods=["GET"])
def get_notifications(email):
    try:
        notifs = []
        for n in notifications_collection.find(
            {"user_email": email}
        ).sort("triggeredAt", -1).limit(20):
            n["_id"] = str(n["_id"])
            notifs.append(n)

        unread_count = notifications_collection.count_documents(
            {"user_email": email, "read": False}
        )

        return jsonify({
            "status": "success",
            "notifications": notifs,
            "unread_count": unread_count
        }), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ----------------------------------------
# ✅ Mark notifications as read
# ----------------------------------------
@alerts_bp.route("/notifications/<email>/read", methods=["POST"])
def mark_read(email):
    try:
        notifications_collection.update_many(
            {"user_email": email, "read": False},
            {"$set": {"read": True}}
        )
        return jsonify({"status": "success"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ----------------------------------------
# ✅ Create alert
# ----------------------------------------
@alerts_bp.route("/", methods=["POST"])
def create_alert():
    try:
        data = request.json
        if not data.get("email") or not data.get("symbol") or not data.get("value"):
            return jsonify({"status": "error", "message": "Missing required fields"}), 400

        alert = {
            "user_email": data.get("email"),
            "symbol": data.get("symbol").upper(),
            "condition": data.get("condition"),
            "value": float(data.get("value")),
            "status": "active",
            "createdAt": datetime.now().strftime("%Y-%m-%d %H:%M")
        }

        result = alerts_collection.insert_one(alert)
        alert["_id"] = str(result.inserted_id)
        return jsonify({"status": "success", "alert": alert}), 201

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ----------------------------------------
# ✅ Delete alert
# ----------------------------------------
@alerts_bp.route("/<alert_id>", methods=["DELETE"])
def delete_alert(alert_id):
    try:
        result = alerts_collection.delete_one({"_id": ObjectId(alert_id)})
        if result.deleted_count:
            return jsonify({"status": "success", "message": "Alert deleted"}), 200
        return jsonify({"status": "error", "message": "Alert not found"}), 404
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500