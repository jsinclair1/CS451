from flask import Blueprint, request, jsonify
from extensions import db
from models import MonthlyBudget, BudgetLimit, Transaction, Category
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import date
from sqlalchemy import func
import uuid

budgets_bp = Blueprint("budgets", __name__)


def get_or_create_monthly_budget(user_id, month_start):
    budget = MonthlyBudget.query.filter_by(
        user_id=user_id,
        month_start=month_start
    ).first()
    if not budget:
        budget = MonthlyBudget(user_id=user_id, month_start=month_start)
        db.session.add(budget)
        db.session.flush()
    return budget


# GET /api/budgets?month=2026-03
@budgets_bp.route("/api/budgets", methods=["GET"])
@jwt_required()
def get_budgets():
    user_id = uuid.UUID(get_jwt_identity())
    month_param = request.args.get("month")  # e.g. "2026-03"

    if month_param:
        try:
            year, month = map(int, month_param.split("-"))
            month_start = date(year, month, 1)
        except:
            return jsonify({"error": "Invalid month format. Use YYYY-MM"}), 400
    else:
        today = date.today()
        month_start = date(today.year, today.month, 1)

    # Get the monthly budget for this user/month
    monthly_budget = MonthlyBudget.query.filter_by(
        user_id=user_id,
        month_start=month_start
    ).first()

    if not monthly_budget:
        return jsonify({
            "month_start": month_start.isoformat(),
            "budget_limits": [],
            "summary": {
                "total_budget": 0,
                "total_spent": 0,
                "remaining": 0,
                "usage_percent": 0
            }
        }), 200

    # Get month end for transaction filtering
    if month_start.month == 12:
        month_end = date(month_start.year + 1, 1, 1)
    else:
        month_end = date(month_start.year, month_start.month + 1, 1)

    # Build budget limits with spent calculated from transactions
    limits = BudgetLimit.query.filter_by(monthly_budget_id=monthly_budget.id).all()
    budget_limits = []
    total_budget = 0
    total_spent = 0

    for limit in limits:
        category = Category.query.get(limit.category_id)

        # Sum transactions for this category in this month
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
        progress = round((spent / limit_amount) * 100, 1) if limit_amount > 0 else 0

        total_budget += limit_amount
        total_spent += spent

        budget_limits.append({
            "id": str(limit.id),
            "category_id": str(limit.category_id),
            "category_name": category.name if category else None,
            "limit_amount": limit_amount,
            "spent": spent,
            "remaining": remaining,
            "progress": progress,
            "status": "Over Budget" if spent > limit_amount else "Warning" if progress >= 80 else "On Track"
        })

    total_remaining = total_budget - total_spent
    usage_percent = round((total_spent / total_budget) * 100, 1) if total_budget > 0 else 0

    return jsonify({
        "month_start": month_start.isoformat(),
        "monthly_budget_id": str(monthly_budget.id),
        "budget_limits": budget_limits,
        "summary": {
            "total_budget": total_budget,
            "total_spent": total_spent,
            "remaining": total_remaining,
            "usage_percent": usage_percent
        }
    }), 200


# POST /api/budgets
@budgets_bp.route("/api/budgets", methods=["POST"])
@jwt_required()
def create_budget():
    user_id = uuid.UUID(get_jwt_identity())
    data = request.get_json()

    month_param = data.get("month")  # e.g. "2026-03"
    category_id = data.get("category_id")
    limit_amount = data.get("limit_amount")

    if not month_param or not category_id or not limit_amount:
        return jsonify({"error": "month, category_id, and limit_amount are required"}), 400

    try:
        year, month = map(int, month_param.split("-"))
        month_start = date(year, month, 1)
    except:
        return jsonify({"error": "Invalid month format. Use YYYY-MM"}), 400

    # Verify category belongs to user
    category = Category.query.filter_by(id=uuid.UUID(category_id), user_id=user_id).first()
    if not category:
        return jsonify({"error": "Category not found"}), 404

    # Get or create the monthly budget
    monthly_budget = get_or_create_monthly_budget(user_id, month_start)

    # Check if a limit already exists for this category this month
    existing = BudgetLimit.query.filter_by(
        monthly_budget_id=monthly_budget.id,
        category_id=uuid.UUID(category_id)
    ).first()
    if existing:
        return jsonify({"error": "A budget limit already exists for this category this month"}), 400

    budget_limit = BudgetLimit(
        monthly_budget_id=monthly_budget.id,
        category_id=uuid.UUID(category_id),
        limit_amount=limit_amount
    )
    db.session.add(budget_limit)
    db.session.commit()

    return jsonify({
        "message": "Budget created",
        "id": str(budget_limit.id)
    }), 201


# PUT /api/budget-limits/<id>
@budgets_bp.route("/api/budget-limits/<limit_id>", methods=["PUT"])
@jwt_required()
def update_budget_limit(limit_id):
    user_id = uuid.UUID(get_jwt_identity())
    data = request.get_json()

    limit = BudgetLimit.query.get(uuid.UUID(limit_id))
    if not limit:
        return jsonify({"error": "Budget limit not found"}), 404

    # Verify ownership through monthly budget
    monthly_budget = MonthlyBudget.query.filter_by(
        id=limit.monthly_budget_id,
        user_id=user_id
    ).first()
    if not monthly_budget:
        return jsonify({"error": "Unauthorized"}), 403

    if "limit_amount" in data:
        limit.limit_amount = data["limit_amount"]
    if "category_id" in data:
        category = Category.query.filter_by(id=uuid.UUID(data["category_id"]), user_id=user_id).first()
        if not category:
            return jsonify({"error": "Category not found"}), 404
        limit.category_id = uuid.UUID(data["category_id"])

    db.session.commit()
    return jsonify({"message": "Budget limit updated"}), 200


# DELETE /api/budget-limits/<id>
@budgets_bp.route("/api/budget-limits/<limit_id>", methods=["DELETE"])
@jwt_required()
def delete_budget_limit(limit_id):
    user_id = uuid.UUID(get_jwt_identity())

    limit = BudgetLimit.query.get(uuid.UUID(limit_id))
    if not limit:
        return jsonify({"error": "Budget limit not found"}), 404

    monthly_budget = MonthlyBudget.query.filter_by(
        id=limit.monthly_budget_id,
        user_id=user_id
    ).first()
    if not monthly_budget:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(limit)
    db.session.commit()
    return jsonify({"message": "Budget limit deleted"}), 200
