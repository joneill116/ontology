import React, { useState } from "react";
import PropTypes from "prop-types";
import "./LoginForm.css";

function LoginForm({ onLogin }) {
  // i18n messages
  const messages = {
    login: "Login",
    username: "Username",
    password: "Password",
    failedLogin: "Login failed",
    invalidUsername: "Username must be 2-30 characters, alphanumeric or underscore.",
    invalidPassword: "Password must be at least 6 characters."
  };
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const errorId = "login-form-error";

  // Helper to sanitize input
  const sanitize = value => {
    if (typeof value !== 'string') return '';
    return value.trim().replace(/[<>"]|'|`/g, '');
  };

  const isValidUsername = name => {
    if (!name) return false;
    if (name.length < 2 || name.length > 30) return false;
    return /^[A-Za-z_][A-Za-z0-9_]*$/.test(name);
  };
  const isValidPassword = pw => {
    return typeof pw === 'string' && pw.length >= 6;
  };

  const errorRef = React.useRef(null);
  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    const sanitizedUsername = sanitize(username);
    const sanitizedPassword = sanitize(password);
    if (!isValidUsername(sanitizedUsername)) {
      setError(messages.invalidUsername);
      setTimeout(() => {
        if (errorRef.current) errorRef.current.focus();
      }, 0);
      return;
    }
    if (!isValidPassword(sanitizedPassword)) {
      setError(messages.invalidPassword);
      setTimeout(() => {
        if (errorRef.current) errorRef.current.focus();
      }, 0);
      return;
    }
  const res = await fetch("http://127.0.0.1:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: sanitizedUsername, password: sanitizedPassword })
    });
    const data = await res.json();
    if (res.status === 200 && data.data && data.data.token) {
      onLogin(data.data.token);
    } else {
      setError(data.error || messages.failedLogin);
      setTimeout(() => {
        if (errorRef.current) errorRef.current.focus();
      }, 0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>{messages.login}</h2>
      <input
        className="login-form__input"
        type="text"
        placeholder={messages.username}
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
        aria-label={messages.username}
        aria-describedby={error ? errorId : undefined}
      />
      <input
        className="login-form__input"
        type="password"
        placeholder={messages.password}
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        aria-label={messages.password}
        aria-describedby={error ? errorId : undefined}
      />
      <button type="submit" className="login-form__input">{messages.login}</button>
      {error && (
        <div
          id={errorId}
          className="login-form__error"
          role="alert"
          tabIndex={-1}
          aria-live="assertive"
          ref={errorRef}
        >
          {error}
        </div>
      )}
    </form>
  );
}

LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired
};

export default LoginForm;
