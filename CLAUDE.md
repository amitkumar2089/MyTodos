# MyTodos

A lightweight, single-user task management web app. Add, complete, and delete todos — no sign-up required, no clutter.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Python 3.11 + FastAPI |
| Storage | SQLite |
| API | REST + JSON |

## Features

- Add a todo by typing and pressing **Enter** or clicking **Add**
- Check the checkbox to mark a todo complete (strikethrough)
- Click the delete icon to remove a todo instantly
- All todos persist across page refreshes and browser restarts
- Responsive layout — works from 320 px wide upwards

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

API runs at `http://localhost:8000`. The SQLite database file (`todos.db`) is created automatically on first start.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`. The Vite dev server proxies `/todos` requests to the backend, so no CORS configuration is needed during development.

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/todos` | List all todos |
| `POST` | `/todos` | Create a new todo |
| `PATCH` | `/todos/{id}` | Toggle completion state |
| `DELETE` | `/todos/{id}` | Delete a todo |

### Data Model

```
Todo
├── id:         integer (auto-increment, primary key)
├── title:      string  (1–200 chars, required)
├── completed:  boolean (default: false)
└── created_at: timestamp
```

## Project Structure

```
MyTodos/
├── backend/
│   ├── main.py          # FastAPI app entry point
│   ├── database.py      # SQLAlchemy engine + session
│   ├── models.py        # Todo ORM model
│   ├── schemas.py       # Pydantic request/response schemas
│   ├── requirements.txt
│   └── routers/
│       └── todos.py     # CRUD route handlers
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx               # Root component + state
        ├── App.css               # Global styles
        ├── main.jsx              # React entry point
        ├── api/
        │   └── todos.js          # Fetch wrappers for API calls
        └── components/
            ├── TodoInput.jsx     # Add-todo form with validation
            ├── TodoList.jsx      # List container + empty state
            └── TodoItem.jsx      # Single todo row
```

## Future Enhancements (Post v1.0)

- Edit todo title in place
- Due dates and reminders
- User authentication and cloud sync
- Categories, tags, and filters
- Dark mode
