from flask import Blueprint, request, jsonify
from extensions import db
from models import Transaction, Category, MonthlyBudget, BudgetLimit
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import date, timedelta
from sqlalchemy import func
import uuid

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/api/dashboard", methods=["GET"])
@jwt_required()
def get_dashboard():
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

    # Month end
    if month_start.month == 12:
        month_end = date(month_start.year + 1, 1, 1)
    else:
        month_end = date(month_start.year, month_start.month + 1, 1)

    # ── Total spent this month ──────────────────────────────────────────────
    total_spent = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == user_id,
        Transaction.txn_date >= month_start,
        Transaction.txn_date < month_end,
        Transaction.type == "expense"
    ).scalar() or 0
    total_spent = float(total_spent)

    # ── Monthly budget total ────────────────────────────────────────────────
    monthly_budget = MonthlyBudget.query.filter_by(
        user_id=user_id,
        month_start=month_start
    ).first()

    total_budget = 0
    if monthly_budget:
        limits = BudgetLimit.query.filter_by(monthly_budget_id=monthly_budget.id).all()
        total_budget = float(sum(float(l.limit_amount) for l in limits))

    budget_used_percent = round((total_spent / total_budget) * 100, 1) if total_budget > 0 else 0
    budget_remaining = total_budget - total_spent

    # ── Category count ──────────────────────────────────────────────────────
    category_count = Category.query.filter_by(
        user_id=user_id,
        is_active=True
    ).count()

    # ── Recurring count ─────────────────────────────────────────────────────
    recurring_count = db.session.query(func.count(Transaction.id)).filter(
        Transaction.user_id == user_id,
        Transaction.txn_date >= month_start,
        Transaction.txn_date < month_end,
        Transaction.title.ilike("%recurring%")
    ).scalar() or 0

    # ── Recent 5 expenses ───────────────────────────────────────────────────
    recent = Transaction.query.filter(
        Transaction.user_id == user_id,
        Transaction.type == "expense"
    ).order_by(Transaction.txn_date.desc()).limit(5).all()

    recent_expenses = [
        {
            "id": str(t.id),
            "title": t.title or t.description or "Expense",
            "date": t.txn_date.strftime("%b %d, %Y"),
            "amount": float(t.amount),
            "category_id": str(t.category_id)
        }
        for t in recent
    ]

    # ── Spending by category this month ─────────────────────────────────────
    category_spending = db.session.query(
        Transaction.category_id,
        func.sum(Transaction.amount).label("total")
    ).filter(
        Transaction.user_id == user_id,
        Transaction.txn_date >= month_start,
        Transaction.txn_date < month_end,
        Transaction.type == "expense"
    ).group_by(Transaction.category_id).all()

    categories_data = []
    for cat_id, total in category_spending:
        category = Category.query.get(cat_id)
        amount = float(total)
        percent = round((amount / total_spent) * 100, 1) if total_spent > 0 else 0
        categories_data.append({
            "category_id": str(cat_id),
            "category_name": category.name if category else "Unknown",
            "amount": amount,
            "percent": percent
        })

    categories_data.sort(key=lambda x: x["amount"], reverse=True)

    # ── 6-month spending trend ───────────────────────────────────────────────
    trend = []
    for i in range(5, -1, -1):
        # Go back i months from month_start
        m = month_start.month - i
        y = month_start.year
        while m <= 0:
            m += 12
            y -= 1
        m_start = date(y, m, 1)
        if m == 12:
            m_end = date(y + 1, 1, 1)
        else:
            m_end = date(y, m + 1, 1)

        monthly_total = db.session.query(func.sum(Transaction.amount)).filter(
            Transaction.user_id == user_id,
            Transaction.txn_date >= m_start,
            Transaction.txn_date < m_end,
            Transaction.type == "expense"
        ).scalar() or 0

        trend.append({
            "month": m_start.strftime("%b"),
            "year": y,
            "total": float(monthly_total)
        })

    return jsonify({
        "month_start": month_start.isoformat(),
        "summary": {
            "total_spent": total_spent,
            "total_budget": total_budget,
            "budget_used_percent": budget_used_percent,
            "budget_remaining": budget_remaining,
            "category_count": category_count,
            "recurring_count": recurring_count
        },
        "recent_expenses": recent_expenses,
        "category_spending": categories_data,
        "trend": trend
    }), 200
