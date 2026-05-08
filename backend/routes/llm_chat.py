from google import genai
import os
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify
from models import Transaction, MonthlyBudget
from flask_jwt_extended import jwt_required, get_jwt_identity
import uuid
import json
from datetime import date, datetime
from decimal import Decimal


load_dotenv()

llm_bp = Blueprint("llm", __name__)

GEMINI_API_KEY = os.getenv("VITE_GEMINI_API_KEY")
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
        return jsonify({"error": "Message is required"}), 400
    
    latest_transactions = get_user_transactions(user_id)
    
    prompt = f""" You are a financial assistant for a banking app.
                  Use only the transaction data provided below.
                  If the answer is not available from the data, provide general budgeting advice.

                  User question: {message}
                  User transaction data: {latest_transactions} 
              """
    
    
    response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents=prompt
)

    return jsonify({"reply": response.text}), 200

'''
def get_user_transactions(user_id, limit=8):
    query = Transaction.query.filter_by(user_id=uuid.UUID(user_id))

    located = query.filter(Transaction.location.isnot(None)).order_by(Transaction.txn_date.desc()).limit(limit).all()
    if located:
        return located

    return query.order_by(Transaction.txn_date.desc()).limit(limit).all()
'''

def get_user_transactions(user_id, limit=8):
   txs= [ "$14.82 | Food & Dining | Lunch combo and drink | Chipotle Mexican Grill, Kansas City, MO | 2026-05-02",

"$67.45 | Transportation | Monthly fuel refill | QuikTrip, Kansas City, MO | 2026-05-03",

"$129.99 | Shopping | Wireless keyboard purchase | Best Buy, Overland Park, KS | 2026-05-04",

"$42.18 | Entertainment | Movie tickets and snacks | AMC Ward Parkway 14, Kansas City, MO | 2026-05-05", "$1,250.00 | Income | Freelance UI prototype payment | Vertex Creative Studio | 2026-05-06"
]
   return txs
   
    
