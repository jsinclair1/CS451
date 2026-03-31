import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

db_url = os.getenv("DATABASE_URL")
secret_key = os.getenv("SECRET_KEY")


if not db_url:
    raise ValueError("DATABASE_URL is not set")

if not secret_key:
    raise ValueError("SECRET_KEY is not set")

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
    SESSION_COOKIE_SAMESITE = "Lax"
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
