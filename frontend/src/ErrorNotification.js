import React from "react";
import "./ErrorNotification.css";

function ErrorNotification({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="error-notification" role="alert" aria-live="assertive">
      <span>{message}</span>
      <button
        className="error-notification__close"
        aria-label="Dismiss error notification"
        onClick={onClose}
        tabIndex={0}
      >
        &times;
      </button>
    </div>
  );
}

export default ErrorNotification;
