from flask import Blueprint, request, jsonify, session
from auth.services.auth_service import register_user, login_user

auth_bp = Blueprint("auth", __name__)

@auth_bp.post("/register")
def register():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify(message="Email and password are required"), 400

    user, error = register_user(email, password)
    if error:
        return jsonify(message=error), 409

    return jsonify(message="User registered successfully", user=user.to_dict()), 201


@auth_bp.post("/login")
def login():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user, error = login_user(email, password)
    if error:
        return jsonify(message=error), 401

    session["user_id"] = user.id
    session["user_email"] = user.email

    return jsonify(message="Login successful", user=user.to_dict()), 200


@auth_bp.post("/logout")
def logout():
    session.clear()
    return jsonify(message="Logged out successfully"), 200


@auth_bp.get("/me")
def me():
    user_id = session.get("user_id")
    user_email = session.get("user_email")

    if not user_id:
        return jsonify(message="Unauthorized"), 401

    return jsonify(
        message="Authenticated",
        user={
            "id": user_id,
            "email": user_email
        }
    ), 200