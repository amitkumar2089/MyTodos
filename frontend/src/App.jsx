import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { createTodo, deleteTodo, fetchTodos, toggleTodo } from "./api/todos";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import Login from "./pages/Login";
import Register from "./pages/Register";

const FILTERS = ["all", "pending", "completed"];

function TodoApp() {
  const { logout } = useAuth();
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  async function reload(currentFilter) {
    try {
      setTodos(await fetchTodos(currentFilter));
    } catch {
      setError("Could not load todos. Is the server running?");
    }
  }

  useEffect(() => {
    reload(filter);
  }, [filter]);

  async function handleAdd(title) {
    try {
      await createTodo(title);
      await reload(filter);
    } catch {
      setError("Failed to add todo.");
    }
  }

  async function handleToggle(id, completed) {
    try {
      await toggleTodo(id, completed);
      await reload(filter);
    } catch {
      setError("Failed to update todo.");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTodo(id);
      await reload(filter);
    } catch {
      setError("Failed to delete todo.");
    }
  }

  return (
    <main className="app">
      <div className="app-header">
        <h1 className="app-title">MyTodo Demo App</h1>
        <button className="logout-btn" type="button" onClick={logout}>
          Log out
        </button>
      </div>
      {error && <p className="app-error">{error}</p>}
      <TodoInput onAdd={handleAdd} />
      <div className="filter-tabs">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`filter-tab${filter === f ? " filter-tab--active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />
    </main>
  );
}

function AuthGate() {
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState("login");

  if (isAuthenticated) return <TodoApp />;

  if (page === "register") {
    return <Register onGoLogin={() => setPage("login")} />;
  }

  return <Login onGoRegister={() => setPage("register")} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}
