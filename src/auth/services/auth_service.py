from auth.repositories.repos import find_user_by_email, create_user
from auth.utils.auth_helpers import hash_password, verify_password

def register_user(email, password):
    existing_user = find_user_by_email(email)
    if existing_user:
        return None, "User already exists"
    print("Password before hashing:", password)
    password_hash = hash_password(password)
    print("User created with hashed pw:", password_hash)
    user = create_user(email, password_hash)
    return user, None

def login_user(email, password):
    user = find_user_by_email(email)
    if not user:
        return None, "Invalid email or password"
    print("login user:", user.password_hash, email)
    
    if not verify_password(user.password_hash, password):
        return None, "Invalid email or password"
    
    return user, None