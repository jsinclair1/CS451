from google import genai
import os
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify
from models import Transaction, Category, MonthlyBudget, BudgetLimit
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from sqlalchemy import func
from datetime import date
import uuid

load_dotenv()

llm_bp = Blueprint("llm", __name__)

GEMINI_API_KEY = os.getenv("VITE_GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)


def get_financial_context(user_id):
    """Build a rich financial context summary for the AI prompt."""
    uid = uuid.UUID(user_id)
    today = date.today()

    # Current month boundaries
    month_start = date(today.year, today.month, 1)
    if today.month == 12:
        month_end = date(today.year + 1, 1, 1)
    else:
        month_end = date(today.year, today.month + 1, 1)

    # ── Total spent and income this month ──────────────────────────────────
    total_spent = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == uid,
        Transaction.txn_date >= month_start,
        Transaction.txn_date < month_end,
        Transaction.type == "expense"
    ).scalar() or 0

    total_income = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == uid,
        Transaction.txn_date >= month_start,
        Transaction.txn_date < month_end,
        Transaction.type == "income"
    ).scalar() or 0

    # ── Spending by category this month ────────────────────────────────────
    category_spending = db.session.query(
        Transaction.category_id,
        func.sum(Transaction.amount).label("total")
    ).filter(
        Transaction.user_id == uid,
        Transaction.txn_date >= month_start,
        Transaction.txn_date < month_end,
        Transaction.type == "expense"
    ).group_by(Transaction.category_id).all()

    category_breakdown = []
    for cat_id, total in category_spending:
        category = Category.query.get(cat_id)
        category_breakdown.append({
            "category": category.name if category else "Unknown",
            "spent": float(total)
        })
    category_breakdown.sort(key=lambda x: x["spent"], reverse=True)

    # ── Budget limits and performance ──────────────────────────────────────
    monthly_budget = MonthlyBudget.query.filter_by(
        user_id=uid,
        month_start=month_start
    ).first()

    budget_info = []
    if monthly_budget:
        limits = BudgetLimit.query.filter_by(monthly_budget_id=monthly_budget.id).all()
        for limit in limits:
            category = Category.query.get(limit.category_id)
            spent = db.session.query(func.sum(Transaction.amount)).filter(
                Transaction.user_id == uid,
                Transaction.category_id == limit.category_id,
                Transaction.txn_date >= month_start,
                Transaction.txn_date < month_end,
                Transaction.type == "expense"
            ).scalar() or 0
            spent = float(spent)
            limit_amount = float(limit.limit_amount)
            budget_info.append({
                "category": category.name if category else "Unknown",
                "limit": limit_amount,
                "spent": spent,
                "remaining": limit_amount - spent,
                "status": "Over Budget" if spent > limit_amount else "Warning" if spent / limit_amount >= 0.8 else "On Track"
            })

    # ── Recent 10 transactions ─────────────────────────────────────────────
    recent = Transaction.query.filter(
        Transaction.user_id == uid
    ).order_by(Transaction.txn_date.desc()).limit(10).all()

    recent_transactions = [
        {
            "date": t.txn_date.strftime("%b %d"),
            "title": t.title or t.description or "Untitled",
            "amount": float(t.amount),
            "type": t.type,
            "category": t.category.name if t.category else "Unknown"
        }
        for t in recent
    ]

    # ── Build context string ───────────────────────────────────────────────
    context = f"""
CURRENT MONTH: {today.strftime("%B %Y")}

MONTHLY SUMMARY:
- Total Spent: ${float(total_spent):.2f}
- Total Income: ${float(total_income):.2f}
- Net Balance: ${float(total_income) - float(total_spent):.2f}

SPENDING BY CATEGORY:
{chr(10).join([f"- {c['category']}: ${c['spent']:.2f}" for c in category_breakdown]) or "No spending data"}

BUDGET PERFORMANCE:
{chr(10).join([f"- {b['category']}: ${b['spent']:.2f} of ${b['limit']:.2f} limit ({b['status']})" for b in budget_info]) or "No budgets set"}

RECENT TRANSACTIONS (last 10):
{chr(10).join([f"- {t['date']} | {t['title']} | ${t['amount']:.2f} | {t['type']} | {t['category']}" for t in recent_transactions]) or "No recent transactions"}
"""
    return context.strip()


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

    financial_context = get_financial_context(user_id)

    prompt = f"""You are a helpful financial assistant for ExpenseApp, a personal budgeting app.
You have access to the user's real financial data for the current month shown below.
Use this data to give specific, personalized advice. Be concise and friendly.
If asked something outside of their financial data, answer generally but remind them you work best with their spending questions.

{financial_context}

User question: {message}"""

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )

    return jsonify({"reply": response.text}), 200