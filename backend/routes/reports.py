from flask import Blueprint, request, jsonify
from extensions import db
from models import Transaction, Category, MonthlyBudget, BudgetLimit
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import date
from sqlalchemy import func
import uuid

reports_bp = Blueprint("reports", __name__)


@reports_bp.route("/api/reports", methods=["GET"])
@jwt_required()
def get_reports():
    user_id = uuid.UUID(get_jwt_identity())
    month_param = request.args.get("month")

    if month_param:
        try:
            year, month = map(int, month_param.split("-"))
            month_start = date(year, month, 1)
        except:
            return jsonify({"error": "Invalid month format. Use YYYY-MM"}), 400
    else:
        today = date.today()
        month_start = date(today.year, today.month, 1)

    if month_start.month == 12:
        month_end = date(month_start.year + 1, 1, 1)
    else:
        month_end = date(month_start.year, month_start.month + 1, 1)

    # ── Total income and expenses ───────────────────────────────────────────
    total_expenses = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == user_id,
        Transaction.txn_date >= month_start,
        Transaction.txn_date < month_end,
        Transaction.type == "expense"
    ).scalar() or 0
    total_expenses = float(total_expenses)

    total_income = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == user_id,
        Transaction.txn_date >= month_start,
        Transaction.txn_date < month_end,
        Transaction.type == "income"
    ).scalar() or 0
    total_income = float(total_income)

    net_balance = total_income - total_expenses

    # ── Spending by category ────────────────────────────────────────────────
    category_spending = db.session.query(
        Transaction.category_id,
        func.sum(Transaction.amount).label("total")
    ).filter(
        Transaction.user_id == user_id,
        Transaction.txn_date >= month_start,
        Transaction.txn_date < month_end,
        Transaction.type == "expense"
    ).group_by(Transaction.category_id).all()

    categories = []
    for cat_id, total in category_spending:
        category = Category.query.get(cat_id)
        amount = float(total)
        percent = round((amount / total_expenses) * 100, 1) if total_expenses > 0 else 0
        categories.append({
            "category_id": str(cat_id),
            "category_name": category.name if category else "Unknown",
            "amount": amount,
            "percent": percent
        })
    categories.sort(key=lambda x: x["amount"], reverse=True)

    # ── Budget performance ──────────────────────────────────────────────────
    monthly_budget = MonthlyBudget.query.filter_by(
        user_id=user_id,
        month_start=month_start
    ).first()

    budget_performance = []
    if monthly_budget:
        limits = BudgetLimit.query.filter_by(monthly_budget_id=monthly_budget.id).all()
        for limit in limits:
            category = Category.query.get(limit.category_id)
            spent = db.session.query(func.sum(Transaction.amount)).filter(
                Transaction.user_id == user_id,
                Transaction.category_id == limit.category_id,
                Transaction.txn_date >= month_start,
                Transaction.txn_date < month_end,
                Transaction.type == "expense"
            ).scalar() or 0
            spent = float(spent)
            limit_amount = float(limit.limit_amount)
            remaining = limit_amount - spent
            budget_performance.append({
                "category_name": category.name if category else "Unknown",
                "limit_amount": limit_amount,
                "spent": spent,
                "remaining": remaining,
                "status": "Over Budget" if spent > limit_amount else "Warning" if spent / limit_amount >= 0.8 else "On Track"
            })

    return jsonify({
        "month_start": month_start.isoformat(),
        "summary": {
            "total_expenses": total_expenses,
            "total_income": total_income,
            "net_balance": net_balance,
        },
        "category_spending": categories,
        "budget_performance": budget_performance
    }), 200
