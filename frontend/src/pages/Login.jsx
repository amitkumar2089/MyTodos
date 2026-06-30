import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login({ onGoRegister }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (!email.trim()) e.email = "Email is required.";
    else if (!EMAIL_RE.test(email)) e.email = "Enter a valid email address.";
    if (!password) e.password = "Password is required.";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setServerError(data.detail || "Invalid email or password.");
        return;
      }
      const data = await res.json();
      login(data.access_token);
      // AuthGate re-renders automatically once token is set in context
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="app-title">MyTodo Demo App</h1>
        <h2 className="auth-heading">Sign in</h2>
        {serverError && <p className="app-error">{serverError}</p>}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label className="auth-label" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              className={`auth-input${errors.email ? " auth-input--error" : ""}`}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="auth-field-error">{errors.email}</p>
            )}
          </div>
          <div className="auth-field">
            <label className="auth-label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              className={`auth-input${errors.password ? " auth-input--error" : ""}`}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="auth-field-error">{errors.password}</p>
            )}
          </div>
          <button
            className="todo-add-btn auth-submit-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="auth-switch">
          Don&apos;t have an account?{" "}
          <button className="auth-link" type="button" onClick={onGoRegister}>
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
