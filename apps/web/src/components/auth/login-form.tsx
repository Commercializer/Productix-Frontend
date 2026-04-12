"use client";

import { useState, useTransition } from "react";
import { loginAction } from "@/lib/auth/actions";

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await loginAction(email, password);

      if (result?.error) {
        setError(result.error);
        return;
      }

      // Use hard navigation (window.location) instead of router.push()
      // to ensure the browser makes a fresh request with the new session cookie.
      // The server action returns the correct role-based redirect URL.
      window.location.href = result.redirectTo || "/dashboard";
    });
  };

  return (
    <div className="login-card">
      {/* Logo */}
      <div className="login-logo">
        <div className="login-logo-icon">P</div>
        <span className="login-logo-text">Productix</span>
      </div>

      <div className="login-header">
        <h1 className="login-title">Welcome back</h1>
        <p className="login-subtitle">Sign in to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            placeholder="you@example.com"
            required
            autoComplete="email"
            disabled={isPending}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            placeholder="••••••••"
            required
            autoComplete="current-password"
            disabled={isPending}
          />
        </div>

        {error && (
          <div className="form-error" role="alert">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            {error}
          </div>
        )}

        <button
          type="submit"
          className="form-submit"
          disabled={isPending}
          id="login-submit-btn"
        >
          {isPending ? (
            <span className="btn-loading">
              <span className="btn-spinner" />
              Signing in…
            </span>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <p className="login-footer">
        Access is managed by your administrator.
      </p>
    </div>
  );
}
