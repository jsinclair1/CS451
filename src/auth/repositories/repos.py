from auth.models.user_model import User

users = []
next_user_id = 1

def find_user_by_email(email):
    for user in users:
        if user.email == email:
            return user
    return None

def create_user(email, password_hash):
    global next_user_id

    user = User(next_user_id, email, password_hash)
    users.append(user)
    next_user_id += 1
    return user

def find_user_by_id(user_id):
    for user in users:
        if user.id == user_id:
            return user
    return None