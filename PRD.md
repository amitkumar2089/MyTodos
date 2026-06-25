# MyTodos — Product Requirements Document

| Field | Detail |
|---|---|
| **Product Name** | MyTodos |
| **Version** | 1.0 |
| **Status** | Draft |
| **Last Updated** | May 30, 2026 |

---

## 1. Overview

MyTodos is a lightweight, single-user task management web application that helps individuals capture, track, and complete their daily tasks without friction. The product prioritizes speed and simplicity over feature richness, targeting users who want a clean, no-nonsense todo list they can open and use in under five seconds.

## 2. Goals & Non-Goals

**Goals**
- Provide an intuitive interface to add, complete, and delete todos.
- Deliver a fast, responsive experience on desktop and mobile browsers.
- Maintain a clean and modern UI with minimal cognitive load.

**Non-Goals (v1.0)**
- User authentication / multi-user accounts.
- Collaboration, sharing, or assignment of todos.
- Due dates, reminders, recurring tasks, categories, or tags.
- Native mobile applications.

## 3. Target Users

Individuals (students, developers, knowledge workers) who need a simple personal task tracker and prefer a distraction-free interface over feature-heavy alternatives like Todoist, TickTick, or Notion.

## 4. Scope

### In Scope
- Create a new todo with a text title.
- View all existing todos in a single list.
- Mark a todo as complete (and toggle back to incomplete).
- Delete a todo permanently.
- Persist todos in a backend database.

### Out of Scope
- Editing the text of an existing todo (deferred to v1.1).
- Search, filter, or sort.
- Drag-and-drop reordering.

---

## 5. Functional Requirements

### FR-1: Create Todo
- A text input field is visible at the top of the page.
- The user types a todo title and presses **Enter** or clicks the **Add** button.
- The new todo appears at the top (or bottom) of the list immediately.
- Empty or whitespace-only entries must be rejected with inline validation.

### FR-2: View Todos
- All todos are displayed as a vertical list.
- Each todo shows: title, completion checkbox, and a delete icon.
- Completed todos are visually distinct (e.g., strikethrough + muted color).

### FR-3: Mark Complete / Incomplete
- Clicking the checkbox toggles the completion state.
- The change is persisted to the backend immediately.

### FR-4: Delete Todo
- Clicking the delete icon removes the todo from the list and the database.
- For v1.0, no confirmation prompt is required (keep it fast).

## 6. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | API responses < 300 ms for typical loads. Initial page load < 2 s. |
| **Usability** | Single-page interface, no navigation required. Works on screens ≥ 320px wide. |
| **Reliability** | Todos are not lost on page refresh or browser close. |
| **Accessibility** | Keyboard-navigable; semantic HTML; sufficient color contrast (WCAG AA). |

---

## 7. Technical Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite |
| **Backend** | Python 3.11 + FastAPI |
| **Storage** | SQLite (v1.0) — simple file-based DB, easy to swap later |
| **API Style** | REST + JSON |

### 7.1 Data Model

```
Todo
├── id:         integer (auto-increment, primary key)
├── title:      string  (required, 1–200 chars)
├── completed:  boolean (default: false)
└── created_at: timestamp
```

### 7.2 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/todos` | List all todos |
| `POST` | `/todos` | Create a new todo |
| `PATCH` | `/todos/{id}` | Toggle completion state |
| `DELETE` | `/todos/{id}` | Delete a todo |

## 8. User Flow

1. User opens MyTodos in a browser.
2. Existing todos are fetched and rendered.
3. User types a task → presses Enter → todo appears in the list.
4. User clicks the checkbox → task is struck through.
5. User clicks the delete icon → task disappears from the list.

## 9. Acceptance Criteria

- [ ] User can add a todo and it appears in the list without a page reload.
- [ ] User can toggle a todo between complete and incomplete states.
- [ ] User can delete a todo and it does not reappear after a refresh.
- [ ] All todos persist after closing and reopening the browser.
- [ ] The application is usable on a mobile viewport (375 × 667).

## 10. Success Metrics

- **Time-to-first-todo:** A new user can add their first todo within 10 seconds of opening the app.
- **Task completion latency:** Toggling complete updates the UI in under 200 ms.
- **Error rate:** Fewer than 1% of API calls fail under normal conditions.

## 11. Future Enhancements (Post v1.0)

- Edit todo title in place.
- Due dates and reminders.
- User authentication and cloud sync.
- Categories, tags, and filters.
- Dark mode.
