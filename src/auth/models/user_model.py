class User:
    def __init__(self, user_id, email, password_hash):
        self.id = user_id
        self.email = email
        self.password_hash = password_hash

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email
        }