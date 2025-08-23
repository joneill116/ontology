import React, { useState } from "react";
import ErrorBoundary from "./ErrorBoundary";
import OntologyEditor from "./OntologyEditor";
import LoginForm from "./LoginForm";
import ErrorNotification from "./ErrorNotification";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("jwt") || "");
  const [globalError, setGlobalError] = useState("");

  const handleLogin = jwt => {
    setToken(jwt);
    localStorage.setItem("jwt", jwt);
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("jwt");
  };

  // Pass setGlobalError to children for error reporting
  return (
    <div className="app-container">
      <h1 className="app-header">Ontology Editor</h1>
  <ErrorNotification message={globalError} onClose={() => setGlobalError("")} />
      {!token ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <>
          <button onClick={handleLogout} className="app-logout">Logout</button>
          <ErrorBoundary>
            <OntologyEditor token={token} setGlobalError={setGlobalError} />
          </ErrorBoundary>
        </>
      )}
    </div>
  );
}

export default App;
