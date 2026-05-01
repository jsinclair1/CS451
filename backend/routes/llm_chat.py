from google import genai
import os
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify
from models import Transaction, MonthlyBudget
from flask_jwt_extended import jwt_required, get_jwt_identity
import uuid

load_dotenv()

llm_bp = Blueprint("llm", __name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)



@llm_bp.route("/api/chat", methods=["POST"])
@jwt_required()
def llm_response():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    message = data.get("message")

    if not message or not message.strip():
        return 
    
    if user_id:
        latest_transactions = get_user_transactions(user_id)
    else:
        return jsonify({"error": "User not logged in"}), 400
        
    prompt = f""" You are a financial assistant for a banking app.
                  Use only the transaction data provided below.
                  If the answer is not available from the data, say that clearly.

                  User question: {message}
                    User transaction data: {latest_transactions if latest_transactions else 'No info provided'}
                  
              """
    
    try:
        response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=prompt
    )
    except TimeoutError:
        return jsonify({"error": "Message is required"}), 400

    return jsonify({"reply": response.text}), 200


def get_user_transactions(user_id, limit=3):
    query = Transaction.query.filter_by(user_id=uuid.UUID(user_id))

    located = query.filter(Transaction.location.isnot(None)).order_by(Transaction.txn_date.desc()).limit(limit).all()
    if located:
        return located

    return query.order_by(Transaction.txn_date.desc()).limit(limit).all()