_CREDS = {"email": "test@example.com", "password": "secret123"}


def _register(client, creds=None):
    return client.post("/auth/register", json=creds or _CREDS)


def _login(client, creds=None):
    return client.post("/auth/login", json=creds or _CREDS)


# ---------------------------------------------------------------------------
# POST /auth/register
# ---------------------------------------------------------------------------

def test_register_new_user(client):
    r = _register(client)
    assert r.status_code == 201
    body = r.json()
    assert body["email"] == _CREDS["email"]
    assert "id" in body
    assert "password" not in body
    assert "hashed_password" not in body


# ---------------------------------------------------------------------------
# POST /auth/login
# ---------------------------------------------------------------------------

def test_login_valid_credentials_returns_token(client):
    _register(client)
    r = _login(client)
    assert r.status_code == 200
    body = r.json()
    assert "access_token" in body
    assert body["token_type"] == "bearer"


# ---------------------------------------------------------------------------
# GET /todos — authenticated
# ---------------------------------------------------------------------------

def test_authenticated_get_todos_returns_200(client):
    _register(client)
    token = _login(client).json()["access_token"]
    r = client.get("/todos", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    assert isinstance(r.json(), list)


# ---------------------------------------------------------------------------
# GET /todos — unauthenticated
# ---------------------------------------------------------------------------

def test_unauthenticated_get_todos_returns_401(client):
    r = client.get("/todos")
    assert r.status_code == 401
