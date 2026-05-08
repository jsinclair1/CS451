from flask import Blueprint, request, jsonify
from extensions import db, bcrypt
from models import User
from flask_jwt_extended import jwt_required, get_jwt_identity
from auth.auth_helper import password_errors
import uuid

user_bp = Blueprint("user", __name__)


# GET /api/user — get current user profile
@user_bp.route("/api/user", methods=["GET"])
@jwt_required()
def get_user():
    user_id = uuid.UUID(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": str(user.id),
        "email": user.email,
        "display_name": user.display_name,
        "created_at": user.created_at.isoformat() if user.created_at else None
    }), 200


# PUT /api/user — update display name
@user_bp.route("/api/user", methods=["PUT"])
@jwt_required()
def update_user():
    user_id = uuid.UUID(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    display_name = data.get("display_name", "").strip()

    if not display_name:
        return jsonify({"error": "Display name cannot be empty"}), 400

    user.display_name = display_name
    db.session.commit()

    return jsonify({
        "message": "Profile updated successfully",
        "display_name": user.display_name
    }), 200


# PUT /api/user/password — change password
@user_bp.route("/api/user/password", methods=["PUT"])
@jwt_required()
def change_password():
    user_id = uuid.UUID(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    current_password = data.get("current_password")
    new_password = data.get("new_password")
    confirm_password = data.get("confirm_password")

    if not current_password or not new_password or not confirm_password:
        return jsonify({"error": "All fields are required"}), 400

    # Verify current password
    if not bcrypt.check_password_hash(user.password_hash, current_password):
        return jsonify({"error": "Current password is incorrect"}), 401

    # Check new passwords match
    if new_password != confirm_password:
        return jsonify({"error": "New passwords do not match"}), 400

    # Validate new password requirements
    errors = password_errors(new_password)
    if errors:
        return jsonify({
            "error": "Password does not meet requirements",
            "requirements": errors
        }), 400

    # Hash and save new password
    user.password_hash = bcrypt.generate_password_hash(new_password).decode("utf-8")
    db.session.commit()

    return jsonify({"message": "Password changed successfully"}), 200
