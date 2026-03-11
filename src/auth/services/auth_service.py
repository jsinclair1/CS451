from auth.utils.auth_helpers import hash_password, verify_password
from db.connect import supabase


def register_user(email, password, name):
    existing_user = find_user_by_email(email)
    if existing_user:
        return "User already exists"
    
    password_hash = hash_password(password)

    supabase.table("users").insert({
        "email": email,
        "password_hash": password_hash,
        "display_name": name
    }).execute()

    return None

def find_user_by_email(email):
    response = supabase.table("users").select("id, email, password_hash").eq("email", email).execute()
    return response.data[0] if response.data else None


def login_user(email, password):
    user = find_user_by_email(email)
    if not user:
        return None, "Invalid email or password"
    
    if not verify_password(user["password_hash"], password):
        return None, "Invalid email or password"
    
    return user, None



