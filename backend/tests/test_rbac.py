"""Unit test suite for Role-Based Access Control (RBAC)."""

from uuid import uuid4







def test_rbac_admin_routes_protection(client):
    suffix = uuid4().hex[:6]
    consumer_email = f"consumer_{suffix}@example.com"
    admin_email = f"admin_{suffix}@example.com"

    # 1. Register a Consumer User
    consumer_payload = {
        "name": "Consumer User",
        "email": consumer_email,
        "password": "ConsumerPassword123!",
    }
    reg_resp = client.post("/api/v1/auth/register", json=consumer_payload)
    assert reg_resp.status_code == 201

    # Login as Consumer
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": consumer_email, "password": "ConsumerPassword123!"},
    )
    assert login_resp.status_code == 200
    consumer_token = login_resp.json()["access_token"]

    # 2. Attempt to call Admin API as Consumer -> Must return 403 Forbidden
    forbidden_resp = client.get(
        "/api/v1/admin/users",
        headers={"Authorization": f"Bearer {consumer_token}"},
    )
    assert forbidden_resp.status_code == 403
    assert "permission" in forbidden_resp.json()["detail"].lower()

    # 3. Register an Admin User
    admin_payload = {
        "name": "Admin User",
        "email": admin_email,
        "password": "AdminPassword123!",
        "role": "admin",
    }
    admin_reg_resp = client.post("/api/v1/auth/register", json=admin_payload)
    assert admin_reg_resp.status_code == 201

    # Login as Admin
    admin_login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": admin_email, "password": "AdminPassword123!"},
    )
    assert admin_login_resp.status_code == 200
    admin_token = admin_login_resp.json()["access_token"]

    # 4. Call Admin API as Admin -> Must return 200 OK
    admin_resp = client.get(
        "/api/v1/admin/users",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert admin_resp.status_code == 200
    assert "items" in admin_resp.json()
