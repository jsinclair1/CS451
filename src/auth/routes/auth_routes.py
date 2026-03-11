import re
from flask import Blueprint, request, jsonify, session
from auth.services.auth_service import register_user, login_user


auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    name = data.get("display_name") or ""

    if not email or not password or not name:
        return jsonify(message="Input Field Missing"), 400
    
    #Password Checks
    errors = password_errors(password)
    if errors:
        return jsonify({
            "error": "Password does not meet requirements",
            "requirements": errors
        }), 400
    
    error = register_user(email, password, name)

    if error == "User already exists":
        return jsonify(message=error), 409
    
    if error:
        return jsonify(message=error), 500
    
    return jsonify(message="User registered successfully"), 201


@auth_bp.post("/login")
def login():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user, error = login_user(email, password)
    if error:
        return jsonify(message=error), 401
    '''
    session["user_id"] = user.id
    session["user_email"] = user.email
    '''
    return jsonify(message="Login successful"), 200
#Can add user data for front-end retrieval + access token


@auth_bp.post("/logout")
def logout():
    session.clear()
    return jsonify(message="Logged out successfully"), 200

'''
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
'''



def password_errors(password: str):
    errors = []

    if len(password) < 8:
        errors.append("at least 8 characters")
    if not re.search(r"[A-Z]", password):
        errors.append("one uppercase letter")
    if not re.search(r"[a-z]", password):
        errors.append("one lowercase letter")
    if not re.search(r"\d", password):
        errors.append("one number")
    if not re.search(r"[@$!%*?&]", password):
        errors.append("one special character (@$!%*?&)")

    return errors