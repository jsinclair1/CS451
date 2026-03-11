import os
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS
from auth.routes.auth_routes import auth_bp
from db.connect import supabase

load_dotenv()

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-change-this")
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_SECURE"] = False

CORS(app, supports_credentials=True)

app.register_blueprint(auth_bp)

@app.get("/")
def home():
    return {"message": "Flask auth server is running"}

def get_users():
    response = supabase.table("users").select("*").execute()
    return jsonify(response.data)

if __name__ == "__main__":
    app.run(debug=True)