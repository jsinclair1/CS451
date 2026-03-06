import os
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS
import psycopg
load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})  # tighten later

    # Example: postgresql://user:pass@localhost:5432/dbname
    DATABASE_URL = os.environ.get("DATABASE_URL")

    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL env var is required")

    @app.get("/health")
    def health():
        return jsonify(status="ok")

    @app.get("/api/db-health")
    def db_health():
        try:
            with psycopg.connect(DATABASE_URL) as conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT 1;")
                    val = cur.fetchone()[0]
            return jsonify(status="ok", db=val)
        except Exception as e:
            return jsonify(status="error", message=str(e)), 500

    return app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)