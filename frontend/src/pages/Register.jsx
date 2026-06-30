import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register({ onGoLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate() {
    const e = {};
    if (!email.trim()) e.email = "Email is required.";
    else if (!EMAIL_RE.test(email)) e.email = "Enter a valid email address.";
    if (!password) e.password = "Password is required.";
    if (!confirm) e.confirm = "Please confirm your password.";
    else if (password && confirm !== password) e.confirm = "Passwords do not match.";
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
      const res = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setServerError(data.detail || "Registration failed. Try a different email.");
        return;
      }
      setSuccess(true);
      setTimeout(() => onGoLogin?.(), 1200);
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
        <h2 className="auth-heading">Create account</h2>
        {success && (
          <p className="auth-success">Account created! Redirecting to sign in…</p>
        )}
        {serverError && <p className="app-error">{serverError}</p>}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label className="auth-label" htmlFor="reg-email">
              Email
            </label>
            <input
              id="reg-email"
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
            <label className="auth-label" htmlFor="reg-password">
              Password
            </label>
            <input
              id="reg-password"
              className={`auth-input${errors.password ? " auth-input--error" : ""}`}
              type="password"
              autoComplete="new-password"
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
          <div className="auth-field">
            <label className="auth-label" htmlFor="reg-confirm">
              Confirm password
            </label>
            <input
              id="reg-confirm"
              className={`auth-input${errors.confirm ? " auth-input--error" : ""}`}
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                setErrors((prev) => ({ ...prev, confirm: "" }));
              }}
              placeholder="••••••••"
            />
            {errors.confirm && (
              <p className="auth-field-error">{errors.confirm}</p>
            )}
          </div>
          <button
            className="todo-add-btn auth-submit-btn"
            type="submit"
            disabled={loading || success}
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account?{" "}
          <button className="auth-link" type="button" onClick={onGoLogin}>
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
