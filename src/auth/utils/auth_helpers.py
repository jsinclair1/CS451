import bcrypt

def hash_password(password):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())


def verify_password(saved_hash, input_password):
    if isinstance(saved_hash, str):
        saved_hash = saved_hash.encode("utf-8")

    if isinstance(input_password, str):
        input_password = input_password.encode("utf-8")

    return bcrypt.checkpw(input_password, saved_hash)

    """
    print("HERE:", type(password))
    print(type(password_hash))
    
    if isinstance(password, str):
        password = password.encode("utf-8")

    if isinstance(password_hash, str):
        password_hash = password_hash.encode("utf-8")
    print("Hash: ", type(password_hash))

    return bcrypt.checkpw(password, password_hash)"""