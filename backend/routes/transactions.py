from flask import Blueprint, request, jsonify
from extensions import db
from models import Transaction, Category
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import uuid

transactions_bp = Blueprint("transactions", __name__)


# ─── Categories ────────────────────────────────────────────────────────────────

@transactions_bp.route("/api/categories", methods=["GET"])
@jwt_required()
def get_categories():
    user_id = get_jwt_identity()
    categories = Category.query.filter_by(user_id=uuid.UUID(user_id), is_active=True).all()
    return jsonify([
        {
            "id": str(c.id),
            "name": c.name,
            "is_income": c.is_income
        } for c in categories
    ]), 200


@transactions_bp.route("/api/categories", methods=["POST"])
@jwt_required()
def create_category():
    user_id = get_jwt_identity()
    data = request.get_json()
    name = data.get("name")
    is_income = data.get("is_income", False)

    if not name:
        return jsonify({"error": "Category name is required"}), 400

    if Category.query.filter_by(user_id=uuid.UUID(user_id), name=name).first():
        return jsonify({"error": "Category already exists"}), 400

    category = Category(
        user_id=uuid.UUID(user_id),
        name=name,
        is_income=is_income
    )
    db.session.add(category)
    db.session.commit()

    return jsonify({
        "message": "Category created",
        "id": str(category.id),
        "name": category.name,
        "is_income": category.is_income
    }), 201


# ─── Transactions ───────────────────────────────────────────────────────────────

@transactions_bp.route("/api/transactions", methods=["GET"])
@jwt_required()
def get_transactions():
    user_id = get_jwt_identity()

    category_id = request.args.get("category_id")
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    search = request.args.get("search")
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 15))

    query = Transaction.query.filter_by(user_id=uuid.UUID(user_id))

    if category_id:
        query = query.filter_by(category_id=uuid.UUID(category_id))
    if start_date:
        query = query.filter(Transaction.txn_date >= datetime.strptime(start_date, "%Y-%m-%d").date())
    if end_date:
        query = query.filter(Transaction.txn_date <= datetime.strptime(end_date, "%Y-%m-%d").date())
    if search:
        query = query.filter(
            Transaction.title.ilike(f"%{search}%") |
            Transaction.description.ilike(f"%{search}%")
        )

    query = query.order_by(Transaction.txn_date.desc())
    paginated = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "transactions": [
            {
                "id": str(t.id),
                "category_id": str(t.category_id),
                "category_name": t.category.name if t.category else None,
                "type": t.type,
                "title": t.title,
                "amount": float(t.amount),
                "txn_date": t.txn_date.isoformat(),
                "description": t.description
                "location": t.location if t.location else None,
            } for t in paginated.items
        ],
        "total": paginated.total,
        "page": paginated.page,
        "pages": paginated.pages,
        "per_page": per_page
    }), 200


@transactions_bp.route("/api/transactions", methods=["POST"])
@jwt_required()
def create_transaction():
    user_id = get_jwt_identity()
    data = request.get_json()

    category_id = data.get("category_id")
    amount = data.get("amount")
    txn_date = data.get("txn_date")
    title = data.get("title", "")
    description = data.get("description") or None
    txn_type = data.get("type", "expense")
    location = data.get("location")

    if txn_type not in ["income", "expense"]:
        txn_type = "expense"

    if not category_id or not amount or not txn_date:
        return jsonify({"error": "category_id, amount, and txn_date are required"}), 400

    category = Category.query.filter_by(id=uuid.UUID(category_id), user_id=uuid.UUID(user_id)).first()
    if not category:
        return jsonify({"error": "Category not found"}), 404

    transaction = Transaction(
        user_id=uuid.UUID(user_id),
        category_id=uuid.UUID(category_id),
        type=txn_type,
        title=title,
        amount=amount,
        txn_date=datetime.strptime(txn_date, "%Y-%m-%d").date(),
        description=description,
        location=location
    )
    db.session.add(transaction)
    db.session.commit()

    return jsonify({
        "message": "Transaction created",
        "id": str(transaction.id)
    }), 201


@transactions_bp.route("/api/transactions/<transaction_id>", methods=["PUT"])
@jwt_required()
def update_transaction(transaction_id):
    user_id = get_jwt_identity()
    data = request.get_json()

    transaction = Transaction.query.filter_by(
        id=uuid.UUID(transaction_id),
        user_id=uuid.UUID(user_id)
    ).first()

    if not transaction:
        return jsonify({"error": "Transaction not found"}), 404

    if "category_id" in data:
        category = Category.query.filter_by(id=uuid.UUID(data["category_id"]), user_id=uuid.UUID(user_id)).first()
        if not category:
            return jsonify({"error": "Category not found"}), 404
        transaction.category_id = uuid.UUID(data["category_id"])

    if "amount" in data:
        transaction.amount = data["amount"]
    if "txn_date" in data:
        transaction.txn_date = datetime.strptime(data["txn_date"], "%Y-%m-%d").date()
    if "title" in data:
        transaction.title = data["title"]
    if "description" in data:
        transaction.description = data["description"] or None
    if "type" in data:
        txn_type = data["type"]
        if txn_type not in ["income", "expense"]:
            txn_type = "expense"
        transaction.type = txn_type
    if "location" in data:
        transaction.location = data["location"]

    db.session.commit()

    return jsonify({"message": "Transaction updated"}), 200


@transactions_bp.route("/api/transactions/<transaction_id>", methods=["DELETE"])
@jwt_required()
def delete_transaction(transaction_id):
    user_id = get_jwt_identity()

    transaction = Transaction.query.filter_by(
        id=uuid.UUID(transaction_id),
        user_id=uuid.UUID(user_id)
    ).first()

    if not transaction:
        return jsonify({"error": "Transaction not found"}), 404

    db.session.delete(transaction)
    db.session.commit()

    return jsonify({"message": "Transaction deleted"}), 200