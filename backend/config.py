import os
from dotenv import load_dotenv
from sqlalchemy import create_engine


load_dotenv()

# Fetch database env variables
USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")

#Plaid env
PLAID_CLIENT_ID = os.getenv('PLAID_CLIENT_ID')
PLAID_SECRET = os.getenv('PLAID_SECRET') 
PLAID_ENV = os.getenv('PLAID_ENV', 'sandbox')
PLAID_PRODUCTS=os.getenv('PLAID_PRODUCTS')
PLAID_COUNTRY_CODES=os.getenv('PLAID_COUNTRY_CODES')
PLAID_ENV=os.getenv('PLAID_ENV')

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("url")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("key")

# Construct the SQLAlchemy connection string
DATABASE_URL = f"postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}?sslmode=require"

# Create the SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# Test the connection
try:
    with engine.connect() as connection:
        print("Connection successful!")
except Exception as e:
    print(f"Failed to connect: {e}")



