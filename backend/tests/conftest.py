import pytest
from app import create_app
from extensions import db as _db
from models import User, Category
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

@pytest.fixture(scope="session")
def app():
    """Create a Flask app configured for testing."""
    app = create_app()
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "JWT_SECRET_KEY": "test-secret-key",
        "WTF_CSRF_ENABLED": False,
    })
    with app.app_context():
        _db.create_all()
        yield app
        _db.drop_all()


@pytest.fixture(scope="session")
def client(app):
    """Flask test client."""
    return app.test_client()


@pytest.fixture(scope="session")
def test_user(app):
    """Create a test user in the database."""
    with app.app_context():
        hashed = bcrypt.generate_password_hash("Test123!").decode("utf-8")
        user = User(
            email="auto_test@test.com",
            password_hash=hashed,
            display_name="Auto User"
        )
        _db.session.add(user)
        _db.session.commit()
        # Refresh to get id
        _db.session.refresh(user)
        return {"id": str(user.id), "email": user.email}


@pytest.fixture(scope="session")
def auth_token(client, test_user):
    """Log in and return a JWT token."""
    res = client.post("/api/login", json={
        "email": "auto_test@test.com",
        "password": "Test123!"
    })
    return res.get_json()["access_token"]


@pytest.fixture(scope="session")
def auth_headers(auth_token):
    """Return Authorization headers with JWT."""
    return {"Authorization": f"Bearer {auth_token}"}


@pytest.fixture(scope="session")
def test_category(app, test_user, auth_headers, client):
    """Create a test category and return its id."""
    res = client.post("/api/categories",
        json={"name": "Test Category", "is_income": False},
        headers=auth_headers
    )
    return res.get_json()["id"]
