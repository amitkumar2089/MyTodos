import { useEffect, useState } from "react";
import { createTodo, deleteTodo, fetchTodos, toggleTodo } from "./api/todos";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";

const FILTERS = ["all", "pending", "completed"];

export default function App() {
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
      <h1 className="app-title">MyTodo Demo App</h1>
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
