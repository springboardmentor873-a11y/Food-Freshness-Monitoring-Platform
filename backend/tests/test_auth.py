"""Unit and API integration tests for user authentication endpoints."""

def test_register_user_success(client):
    response = client.post(
        "/api/v1/auth/register",
        json={"name": "Alice Developer", "email": "alice@example.com", "password": "SecurePassword123!"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Alice Developer"
    assert data["email"] == "alice@example.com"
    assert "id" in data


def test_login_user_success(client):
    client.post(
        "/api/v1/auth/register",
        json={"name": "Bob Developer", "email": "bob@example.com", "password": "SecurePassword123!"},
    )
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "bob@example.com", "password": "SecurePassword123!"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["user"]["email"] == "bob@example.com"


def test_forgot_and_reset_password(client):
    client.post(
        "/api/v1/auth/register",
        json={"name": "Charlie Test", "email": "charlie@example.com", "password": "OriginalPassword123!"},
    )
    forgot_res = client.post("/api/v1/auth/forgot-password", json={"email": "charlie@example.com"})
    assert forgot_res.status_code == 200
    reset_token = forgot_res.json()["reset_token"]

    reset_res = client.post(
        "/api/v1/auth/reset-password",
        json={"token": reset_token, "new_password": "NewPassword123!"},
    )
    assert reset_res.status_code == 204

    # Verify login with new password
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "charlie@example.com", "password": "NewPassword123!"},
    )
    assert login_res.status_code == 200


def test_google_login_auto_register(client):
    response = client.post(
        "/api/v1/auth/google",
        json={"email": "google.user@example.com", "name": "Google User"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["user"]["email"] == "google.user@example.com"
    assert data["user"]["role"] == "consumer"

