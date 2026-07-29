import json
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert "Food Freshness Monitoring" in response.text


def test_login_failure():
    response = client.post("/api/login", data={"username": "wrong", "password": "wrong"})
    assert response.status_code == 401


def test_login_success():
    response = client.post("/api/login", data={"username": "customer1", "password": "password1"})
    assert response.status_code == 200
    data = response.json()
    assert data["access_token"]
    assert data["token_type"] == "bearer"


def test_dataset_status_endpoints():
    login = client.post("/api/login", data={"username": "manager1", "password": "password2"})
    assert login.status_code == 200
    token = login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    structured_response = client.get("/api/dataset/status", headers=headers)
    assert structured_response.status_code == 200
    structured_data = structured_response.json()
    assert "dataset_exists" in structured_data
    assert "model_exists" in structured_data
    assert "dataset_path" in structured_data

    image_response = client.get("/api/dataset/image/status", headers=headers)
    assert image_response.status_code == 200
    image_data = image_response.json()
    assert "dataset_exists" in image_data
    assert "model_exists" in image_data
    assert "dataset_path" in image_data
    assert "model_path" in image_data


def test_inventory_crud():
    login = client.post("/api/login", data={"username": "customer1", "password": "password1"})
    assert login.status_code == 200
    token = login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    create = client.post(
        "/api/items/",
        headers=headers,
        json={
            "product_name": "Test Apple",
            "product_type": "apple",
            "category": "fruit",
            "storage_temperature": 4.0,
            "humidity": 60.0,
            "age_days": 2,
            "status": "Fresh",
        },
    )
    assert create.status_code == 200
    item = create.json()
    assert item["id"] == 1
    assert item["product_name"] == "Test Apple"

    get_one = client.get(f"/api/items/{item['id']}", headers=headers)
    assert get_one.status_code == 200
    assert get_one.json()["id"] == item["id"]

    update = client.put(
        f"/api/items/{item['id']}",
        headers=headers,
        json={
            "product_name": "Test Apple Updated",
            "product_type": "apple",
            "category": "fruit",
            "storage_temperature": 3.5,
            "humidity": 55.0,
            "age_days": 3,
            "status": "Fresh",
        },
    )
    assert update.status_code == 200
    assert update.json()["product_name"] == "Test Apple Updated"

    delete = client.delete(f"/api/items/{item['id']}", headers=headers)
    assert delete.status_code == 200
    assert delete.json()["message"] == "Inventory item deleted."

    list_after = client.get("/api/items/", headers=headers)
    assert list_after.status_code == 200
    assert list_after.json() == []


def test_recommend_default():
    response = client.post(
        "/api/recommend/",
        json={
            "product_type": "apple",
            "category": "fruit",
            "temperature": 10,
            "humidity": 60,
            "age_days": 5,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "recommendations" in data
    assert data["risk_level"] in ["Low", "Medium", "High"]
