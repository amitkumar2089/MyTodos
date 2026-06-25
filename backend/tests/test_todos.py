def _post(client, title):
    return client.post("/todos", json={"title": title})


# ---------------------------------------------------------------------------
# GET /todos
# ---------------------------------------------------------------------------

def test_list_todos_empty(client):
    r = client.get("/todos")
    assert r.status_code == 200
    assert r.json() == []


def test_list_todos_returns_created_items(client):
    _post(client, "Task A")
    _post(client, "Task B")
    r = client.get("/todos")
    assert r.status_code == 200
    assert len(r.json()) == 2


def test_list_todos_ordered_desc_by_id(client):
    id_a = _post(client, "Task A").json()["id"]
    id_b = _post(client, "Task B").json()["id"]
    items = client.get("/todos").json()
    assert items[0]["id"] == id_b
    assert items[1]["id"] == id_a


def test_list_todo_response_shape(client):
    _post(client, "Shape test")
    item = client.get("/todos").json()[0]
    assert {"id", "title", "completed", "created_at"} <= item.keys()
    assert item["completed"] is False


# ---------------------------------------------------------------------------
# GET /todos?status=
# ---------------------------------------------------------------------------

def _setup_mixed(client):
    id_a = _post(client, "Pending task").json()["id"]
    id_b = _post(client, "Done task").json()["id"]
    client.patch(f"/todos/{id_b}", json={"completed": True})
    return id_a, id_b


def test_list_todos_status_defaults_to_all(client):
    _setup_mixed(client)
    assert len(client.get("/todos").json()) == 2


def test_list_todos_status_all(client):
    _setup_mixed(client)
    assert len(client.get("/todos", params={"status": "all"}).json()) == 2


def test_list_todos_status_pending(client):
    id_a, _ = _setup_mixed(client)
    items = client.get("/todos", params={"status": "pending"}).json()
    assert len(items) == 1
    assert items[0]["id"] == id_a
    assert items[0]["completed"] is False


def test_list_todos_status_completed(client):
    _, id_b = _setup_mixed(client)
    items = client.get("/todos", params={"status": "completed"}).json()
    assert len(items) == 1
    assert items[0]["id"] == id_b
    assert items[0]["completed"] is True


def test_list_todos_status_pending_empty(client):
    id_a, _ = _setup_mixed(client)
    client.patch(f"/todos/{id_a}", json={"completed": True})
    assert client.get("/todos", params={"status": "pending"}).json() == []


def test_list_todos_status_completed_empty(client):
    assert client.get("/todos", params={"status": "completed"}).json() == []


def test_list_todos_status_invalid(client):
    assert client.get("/todos", params={"status": "done"}).status_code == 422


# ---------------------------------------------------------------------------
# POST /todos
# ---------------------------------------------------------------------------

def test_create_todo_success(client):
    r = _post(client, "Buy milk")
    assert r.status_code == 201
    body = r.json()
    assert body["title"] == "Buy milk"
    assert body["completed"] is False
    assert body["id"] is not None
    assert body["created_at"] is not None


def test_create_todo_strips_whitespace(client):
    r = _post(client, "  Buy milk  ")
    assert r.status_code == 201
    assert r.json()["title"] == "Buy milk"


def test_create_todo_empty_title(client):
    assert _post(client, "").status_code == 422


def test_create_todo_whitespace_only(client):
    # strip_whitespace=True reduces "   " to "" which fails min_length=1
    assert _post(client, "   ").status_code == 422


def test_create_todo_title_too_long(client):
    assert _post(client, "x" * 201).status_code == 422


def test_create_todo_missing_title_field(client):
    r = client.post("/todos", json={})
    assert r.status_code == 422


def test_create_todo_appears_in_list(client):
    title = "Appears in list"
    _post(client, title)
    items = client.get("/todos").json()
    assert any(i["title"] == title for i in items)


# ---------------------------------------------------------------------------
# PATCH /todos/{id}
# ---------------------------------------------------------------------------

def test_toggle_todo_complete(client):
    todo_id = _post(client, "Toggle me").json()["id"]
    r = client.patch(f"/todos/{todo_id}", json={"completed": True})
    assert r.status_code == 200
    assert r.json()["completed"] is True


def test_toggle_todo_uncomplete(client):
    todo_id = _post(client, "Toggle me").json()["id"]
    client.patch(f"/todos/{todo_id}", json={"completed": True})
    r = client.patch(f"/todos/{todo_id}", json={"completed": False})
    assert r.status_code == 200
    assert r.json()["completed"] is False


def test_toggle_todo_not_found(client):
    r = client.patch("/todos/9999", json={"completed": True})
    assert r.status_code == 404
    assert r.json()["detail"] == "Todo not found"


def test_toggle_todo_preserves_title(client):
    todo_id = _post(client, "Preserved title").json()["id"]
    r = client.patch(f"/todos/{todo_id}", json={"completed": True})
    assert r.json()["title"] == "Preserved title"


def test_toggle_todo_missing_field(client):
    todo_id = _post(client, "Missing field").json()["id"]
    r = client.patch(f"/todos/{todo_id}", json={})
    assert r.status_code == 422


def test_toggle_todo_invalid_id_type(client):
    r = client.patch("/todos/abc", json={"completed": True})
    assert r.status_code == 422


# ---------------------------------------------------------------------------
# DELETE /todos/{id}
# ---------------------------------------------------------------------------

def test_delete_todo_success(client):
    todo_id = _post(client, "Delete me").json()["id"]
    r = client.delete(f"/todos/{todo_id}")
    assert r.status_code == 204
    assert r.content == b""


def test_delete_todo_not_found(client):
    r = client.delete("/todos/9999")
    assert r.status_code == 404
    assert r.json()["detail"] == "Todo not found"


def test_delete_todo_removes_from_list(client):
    todo_id = _post(client, "Remove from list").json()["id"]
    client.delete(f"/todos/{todo_id}")
    assert client.get("/todos").json() == []


def test_delete_todo_second_delete(client):
    # Current implementation is not idempotent — second delete returns 404
    todo_id = _post(client, "Double delete").json()["id"]
    client.delete(f"/todos/{todo_id}")
    r = client.delete(f"/todos/{todo_id}")
    assert r.status_code == 404


def test_delete_todo_invalid_id_type(client):
    r = client.delete("/todos/abc")
    assert r.status_code == 422
