from flask import Flask
from extensions import db, migrate, login_manager, bcrypt, cors, jwt
from config import Config
from auth.auth import auth
from routes.transactions import transactions_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(app, supports_credentials=True)
    jwt.init_app(app)

    # Register blueprints
    app.register_blueprint(auth)
    app.register_blueprint(transactions_bp)
    return app
    
app = create_app()
if __name__ == "__main__":
    app.run(debug=True)
