import bcrypt
import re

def hash_password(password):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(saved_hash, input_password):
    if isinstance(saved_hash, str):
        saved_hash = saved_hash.encode("utf-8")

    if isinstance(input_password, str):
        input_password = input_password.encode("utf-8")

    return bcrypt.checkpw(input_password, saved_hash)

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
