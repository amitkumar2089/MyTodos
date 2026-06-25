import { useEffect, useState } from "react";
import { createTodo, deleteTodo, fetchTodos, toggleTodo } from "./api/todos";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTodos()
      .then(setTodos)
      .catch(() => setError("Could not load todos. Is the server running?"));
  }, []);

  async function handleAdd(title) {
    try {
      const todo = await createTodo(title);
      setTodos((prev) => [todo, ...prev]);
    } catch {
      setError("Failed to add todo.");
    }
  }

  async function handleToggle(id, completed) {
    try {
      const updated = await toggleTodo(id, completed);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch {
      setError("Failed to update todo.");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError("Failed to delete todo.");
    }
  }

  return (
    <main className="app">
      <h1 className="app-title">MyTodo Demo App</h1>
      {error && <p className="app-error">{error}</p>}
      <TodoInput onAdd={handleAdd} />
      <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />
    </main>
  );
}
