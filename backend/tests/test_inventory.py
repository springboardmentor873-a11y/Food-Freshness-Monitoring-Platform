"""Unit and API integration tests for user inventory management."""

def get_auth_header(client, email="inventory_user@example.com"):
    client.post(
        "/api/v1/auth/register",
        json={"name": "Inventory User", "email": email, "password": "SecurePassword123!"},
    )
    res = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": "SecurePassword123!"},
    )
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_inventory_crud_operations(client):
    headers = get_auth_header(client)

    # 1. Create item
    create_res = client.post(
        "/api/v1/inventory",
        json={
          "food_name": "Organic Fresh Apples",
          "category": "Fruits",
          "quantity": 10,
          "purchase_date": "2026-07-20",
          "expiry_date": "2026-08-05",
          "storage_location": "Main Refrigerator Container A",
        },
        headers=headers,
    )
    assert create_res.status_code == 201
    item = create_res.json()
    assert item["food_name"] == "Organic Fresh Apples"
    item_id = item["id"]

    # 2. List inventory
    list_res = client.get("/api/v1/inventory", headers=headers)
    assert list_res.status_code == 200
    assert list_res.json()["total"] == 1

    # 3. Update item
    update_res = client.patch(
        f"/api/v1/inventory/{item_id}",
        json={"quantity": 8},
        headers=headers,
    )
    assert update_res.status_code == 200
    assert update_res.json()["quantity"] == 8

    # 4. Delete item
    del_res = client.delete(f"/api/v1/inventory/{item_id}", headers=headers)
    assert del_res.status_code == 204
