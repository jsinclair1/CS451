from flask import Flask
from extensions import db, migrate, login_manager, bcrypt, cors, jwt
from config import Config
from auth.auth import auth
from routes.transactions import transactions_bp
<<<<<<< HEAD
<<<<<<< Updated upstream
=======
from routes.budgets import budgets_bp
from routes.dashboard import dashboard_bp
from routes.llm_chat import llm_bp
>>>>>>> Stashed changes
=======
from routes.budgets import budgets_bp
from routes.dashboard import dashboard_bp
from routes.llm_chat import llm_bp
>>>>>>> 25d79d6f40c823c82ce7dd25a67aa120219a1ba6

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
<<<<<<< HEAD
<<<<<<< Updated upstream
=======
=======
>>>>>>> 25d79d6f40c823c82ce7dd25a67aa120219a1ba6
    app.register_blueprint(budgets_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(llm_bp)

<<<<<<< HEAD
>>>>>>> Stashed changes
=======
>>>>>>> 25d79d6f40c823c82ce7dd25a67aa120219a1ba6
    return app
    
app = create_app()
if __name__ == "__main__":
    app.run(debug=True, port=5050)
