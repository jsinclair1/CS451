from flask import Blueprint, request, jsonify
from extensions import db, bcrypt
from models import User
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from auth.auth_helper import password_errors
import uuid

auth = Blueprint("auth", __name__)

# Register
@auth.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    display_name = data.get("display_name")

    if not email or not password or not display_name:
        return jsonify({"message": "Input Field Missing"}), 400

    # Check if email already exists
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    # Check password meets criteria
    errors = password_errors(password)
    if errors:
        return jsonify({
            "error": "Password does not meet requirements",
            "requirements": errors
        }), 400

    # Hash the password
    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    # Create new user
    new_user = User(
        email=email,
        password_hash=hashed_password,
        display_name=display_name
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201


# Login
@auth.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Find user
    user = User.query.filter_by(email=email).first()

    # Check password
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid email or password"}), 401

    # Issue JWT — identity is the user's UUID as a string
    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Logged in successfully",
        "access_token": access_token,
        "user": {
            "id": str(user.id),
            "email": user.email,
            "display_name": user.display_name
        }
    }), 200


# Logout — JWT is stateless; logout is handled client-side by deleting the token.
# This endpoint exists so the frontend has a consistent call to make on logout.
@auth.route("/api/logout", methods=["POST"])
@jwt_required()
def logout():
    return jsonify({"message": "Logged out successfully"}), 200


# Me — verify token and return current user info
@auth.route("/api/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(uuid.UUID(user_id))

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": str(user.id),
        "email": user.email,
        "display_name": user.display_name,
        "created_at": user.created_at.isoformat() if user.created_at else None
    }), 200
