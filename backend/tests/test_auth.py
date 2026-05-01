"""
Test cases: 4.6.1.1 - 4.6.1.6
Authentication endpoint tests.
"""


# ── 4.6.1.1 ────────────────────────────────────────────────────────────────────
def test_register_valid_returns_201(client):
    """POST /api/register with valid data returns 201."""
    res = client.post("/api/register", json={
        "email": "newregister@test.com",
        "password": "Test123!",
        "display_name": "New User"
    })
    assert res.status_code == 201
    assert res.get_json()["message"] == "User created successfully"


# ── 4.6.1.2 ────────────────────────────────────────────────────────────────────
def test_register_duplicate_email_returns_400(client, test_user):
    """POST /api/register with duplicate email returns 400."""
    res = client.post("/api/register", json={
        "email": "auto_test@test.com",
        "password": "Test123!",
        "display_name": "Duplicate User"
    })
    assert res.status_code == 400
    assert "Email already exists" in res.get_json()["error"]


# ── 4.6.1.3 ────────────────────────────────────────────────────────────────────
def test_login_valid_returns_token(client, test_user):
    """POST /api/login with valid credentials returns 200 and access_token."""
    res = client.post("/api/login", json={
        "email": "auto_test@test.com",
        "password": "Test123!"
    })
    data = res.get_json()
    assert res.status_code == 200
    assert "access_token" in data
    assert "user" in data
    assert data["user"]["email"] == "auto_test@test.com"


# ── 4.6.1.4 ────────────────────────────────────────────────────────────────────
def test_login_invalid_password_returns_401(client, test_user):
    """POST /api/login with wrong password returns 401."""
    res = client.post("/api/login", json={
        "email": "auto_test@test.com",
        "password": "WrongPass99!"
    })
    assert res.status_code == 401
    assert "Invalid email or password" in res.get_json()["error"]


# ── 4.6.1.5 ────────────────────────────────────────────────────────────────────
def test_me_with_valid_token_returns_user(client, auth_headers, test_user):
    """GET /api/me with valid token returns user object."""
    res = client.get("/api/me", headers=auth_headers)
    data = res.get_json()
    assert res.status_code == 200
    assert "id" in data
    assert "email" in data
    assert "display_name" in data
    assert data["email"] == "auto_test@test.com"


# ── 4.6.1.6 ────────────────────────────────────────────────────────────────────
def test_me_without_token_returns_401(client):
    """GET /api/me without token returns 401."""
    res = client.get("/api/me")
    assert res.status_code == 401
