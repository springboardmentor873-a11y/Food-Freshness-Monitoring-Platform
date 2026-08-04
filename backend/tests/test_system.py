"""Tests for system health, readiness, and liveness probes."""

def test_health_endpoint(client):
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "Healthy"


def test_live_endpoint(client):
    res = client.get("/live")
    assert res.status_code == 200
    assert res.json()["status"] == "Alive"


def test_ready_endpoint(client):
    res = client.get("/ready")
    assert res.status_code == 200
    assert res.json()["status"] == "Ready"
    assert res.json()["database"] == "Connected"
