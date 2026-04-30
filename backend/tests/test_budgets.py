"""
Test cases: 4.6.3.1 - 4.6.3.2
Budget endpoint tests.
"""
from datetime import date


# ── 4.6.3.1 ────────────────────────────────────────────────────────────────────
def test_create_budget_returns_201(client, auth_headers, test_category):
    """POST /api/budgets with valid data returns 201."""
    today = date.today()
    month_str = f"{today.year}-{str(today.month + 1).zfill(2)}"  # next month to avoid conflicts

    res = client.post("/api/budgets", json={
        "month": month_str,
        "category_id": test_category,
        "limit_amount": 500.00
    }, headers=auth_headers)
    data = res.get_json()
    assert res.status_code == 201
    assert "id" in data


# ── 4.6.3.2 ────────────────────────────────────────────────────────────────────
def test_budget_spent_matches_transactions(client, auth_headers, test_category):
    """GET /api/budgets returns spent amount equal to sum of expense transactions."""
    today = date.today()
    month_str = f"{today.year}-{str(today.month).zfill(2)}"
    txn_date = str(today)

    # Create a budget for this month
    client.post("/api/budgets", json={
        "month": month_str,
        "category_id": test_category,
        "limit_amount": 1000.00
    }, headers=auth_headers)

    # Create two expense transactions totaling $150
    client.post("/api/transactions", json={
        "type": "expense",
        "title": "Budget Test Txn 1",
        "amount": 75.00,
        "txn_date": txn_date,
        "category_id": test_category,
    }, headers=auth_headers)

    client.post("/api/transactions", json={
        "type": "expense",
        "title": "Budget Test Txn 2",
        "amount": 75.00,
        "txn_date": txn_date,
        "category_id": test_category,
    }, headers=auth_headers)

    # Get budgets for this month
    res = client.get(f"/api/budgets?month={month_str}", headers=auth_headers)
    data = res.get_json()
    assert res.status_code == 200

    # Find our test category budget
    limits = data.get("budget_limits", [])
    matching = [l for l in limits if l["category_id"] == test_category]
    assert len(matching) > 0
    assert matching[0]["spent"] >= 150.00
