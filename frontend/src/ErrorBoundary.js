import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to an error reporting service if needed
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    // Example: send error to backend
    fetch("/api/log-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.toString(), errorInfo })
    }).catch(() => {});
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong in the UI.</h2>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
