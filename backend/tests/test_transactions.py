"""
Test cases: 4.6.2.1 - 4.6.2.4
Transaction endpoint tests.
"""
from datetime import date


# ── 4.6.2.1 ────────────────────────────────────────────────────────────────────
def test_create_expense_returns_201(client, auth_headers, test_category):
    """POST /api/transactions with valid expense data returns 201."""
    res = client.post("/api/transactions", json={
        "type": "expense",
        "title": "Auto Expense",
        "amount": 50.00,
        "txn_date": str(date.today()),
        "category_id": test_category,
        "description": "Automated test transaction"
    }, headers=auth_headers)
    data = res.get_json()
    assert res.status_code == 201
    assert "id" in data


# ── 4.6.2.2 ────────────────────────────────────────────────────────────────────
def test_create_transaction_missing_fields_returns_400(client, auth_headers, test_category):
    """POST /api/transactions without txn_date returns 400."""
    res = client.post("/api/transactions", json={
        "type": "expense",
        "title": "Missing Date",
        "amount": 25.00,
        "category_id": test_category
        # txn_date intentionally omitted
    }, headers=auth_headers)
    assert res.status_code == 400


# ── 4.6.2.3 ────────────────────────────────────────────────────────────────────
def test_get_transactions_returns_paginated_list(client, auth_headers):
    """GET /api/transactions returns 200 with correct structure."""
    res = client.get("/api/transactions?page=1&per_page=15", headers=auth_headers)
    data = res.get_json()
    assert res.status_code == 200
    assert "transactions" in data
    assert "total" in data
    assert "page" in data
    assert "pages" in data
    assert isinstance(data["transactions"], list)


# ── 4.6.2.4 ────────────────────────────────────────────────────────────────────
def test_delete_transaction_returns_200(client, auth_headers, test_category):
    """DELETE /api/transactions/<id> returns 200 and removes the transaction."""
    # Create a transaction to delete
    create_res = client.post("/api/transactions", json={
        "type": "expense",
        "title": "To Be Deleted",
        "amount": 10.00,
        "txn_date": str(date.today()),
        "category_id": test_category,
    }, headers=auth_headers)
    assert create_res.status_code == 201
    txn_id = create_res.get_json()["id"]

    # Delete it
    delete_res = client.delete(f"/api/transactions/{txn_id}", headers=auth_headers)
    assert delete_res.status_code == 200
    assert delete_res.get_json()["message"] == "Transaction deleted"

    # Confirm it no longer appears
    list_res = client.get("/api/transactions", headers=auth_headers)
    txn_ids = [t["id"] for t in list_res.get_json()["transactions"]]
    assert txn_id not in txn_ids
