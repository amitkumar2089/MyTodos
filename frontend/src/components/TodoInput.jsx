import { useState } from "react";

export default function TodoInput({ onAdd }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim()) {
      setError("Todo cannot be empty.");
      return;
    }
    onAdd(value.trim());
    setValue("");
    setError("");
  }

  return (
    <form className="todo-input-form" onSubmit={handleSubmit}>
      <input
        className="todo-input"
        type="text"
        placeholder="What needs to be done?"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (error) setError("");
        }}
        aria-label="New todo"
      />
      <button className="todo-add-btn" type="submit">
        Add
      </button>
      {error && <p className="todo-input-error">{error}</p>}
    </form>
  );
}
