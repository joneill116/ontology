import React, { useState, useEffect, useRef } from "react";
import ClassForm from "./ClassForm";
import PropertyForm from "./PropertyForm";
import ConstraintForm from "./ConstraintForm";
import HierarchyTree from "./HierarchyTree";

const API_URL = "http://127.0.0.1:5000/api";

function OntologyEditor({ token, setGlobalError }) {
  // Add missing handlers for form changes and submissions
  const handleClassChange = e => {
    const { name, value } = e.target;
    setClassForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePropertyChange = e => {
    const { name, value } = e.target;
    setPropertyForm(prev => ({ ...prev, [name]: value }));
  };

  const handleConstraintChange = e => {
    const { name, value } = e.target;
    setConstraintForm(prev => ({ ...prev, [name]: value }));
  };

  const submitClass = async ({ sanitizedForm }) => {
    setMessage("");
    setGlobalError("");
    try {
      const res = await fetch(`${API_URL}/classes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(sanitizedForm)
      });
      if (res.status === 200) {
        setMessage("Class added successfully.");
        setClassForm({ name: "", label: "", comment: "", parent: "" });
        setClasses(await (await fetch(`${API_URL}/classes`)).json());
      } else {
        const data = await res.json();
        setGlobalError(data.error || "Failed to add class.");
      }
    } catch (e) {
      setGlobalError("Network error.");
    }
  };

  const submitProperty = async ({ sanitizedForm }) => {
    setMessage("");
    setGlobalError("");
    try {
      const res = await fetch(`${API_URL}/properties`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(sanitizedForm)
      });
      if (res.status === 200) {
        setMessage("Property added successfully.");
        setPropertyForm({ name: "", type: "object", domain: "", range: "", label: "", comment: "" });
        setProperties(await (await fetch(`${API_URL}/properties`)).json());
      } else {
        const data = await res.json();
        setGlobalError(data.error || "Failed to add property.");
      }
    } catch (e) {
      setGlobalError("Network error.");
    }
  };

  const submitConstraint = async ({ sanitizedForm }) => {
    setMessage("");
    setGlobalError("");
    try {
      const res = await fetch(`${API_URL}/constraints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(sanitizedForm)
      });
      if (res.status === 200) {
        setMessage("Constraint added successfully.");
        setConstraintForm({ class: "", property: "", type: "minCardinality", value: "" });
      } else {
        const data = await res.json();
        setGlobalError(data.error || "Failed to add constraint.");
      }
    } catch (e) {
      setGlobalError("Network error.");
    }
  };
  const mainContentRef = useRef(null);
  const [classes, setClasses] = useState([]);
  const [properties, setProperties] = useState([]);
  const [classForm, setClassForm] = useState({ name: "", label: "", comment: "", parent: "" });
  const [propertyForm, setPropertyForm] = useState({ name: "", type: "object", domain: "", range: "", label: "", comment: "" });
  const [message, setMessage] = useState("");
  const [constraintForm, setConstraintForm] = useState({ class: "", property: "", type: "minCardinality", value: "" });

  const handleExport = async (format = "turtle") => {
    try {
      const res = await fetch(`${API_URL}/export?format=${format}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ontology.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setGlobalError("Error exporting ontology.");
    }
  };

  const handleImport = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setMessage("");
    setGlobalError("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("format", "turtle");
    try {
      const res = await fetch(`${API_URL}/import`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (res.status === 200) {
        setMessage("Ontology imported successfully.");
        const classesRes = await fetch(`${API_URL}/classes`);
        setClasses(await classesRes.json());
        const propsRes = await fetch(`${API_URL}/properties`);
        setProperties(await propsRes.json());
      } else {
        setGlobalError(data.error || "Error importing ontology.");
      }
    } catch (e) {
      setGlobalError("Network error.");
    }
  };

  // Helper to build class hierarchy tree
  const buildTree = (classes) => {
    const map = {};
    classes.forEach(c => { map[c.name] = { ...c, children: [] }; });
    const roots = [];
    classes.forEach(c => {
      if (c.parent && map[c.parent]) {
        map[c.parent].children.push(map[c.name]);
      } else {
        roots.push(map[c.name]);
      }
    });
    return roots;
  };

  return (
    <>
      {/* Skip to content link for screen readers */}
      <a href="#main-content" className="skip-link" tabIndex={0}>Skip to main content</a>
      <div className="ontology-editor" id="main-content" ref={mainContentRef} tabIndex={-1} aria-label="Ontology Editor Main Content">
        <div className="ontology-section" tabIndex={0} aria-labelledby="classes-heading">
          <h2 id="classes-heading">Classes</h2>
          <ClassForm
            classForm={classForm}
            classes={classes}
            onChange={handleClassChange}
            onSubmit={submitClass}
          />
          <h3 id="hierarchy-heading">Class Hierarchy</h3>
          <div role="tree" aria-labelledby="hierarchy-heading">
            <HierarchyTree nodes={buildTree(classes)} />
          </div>
          <ul className="ontology-list" role="list" aria-label="Class List">
            {classes.map(c => (
              <li key={c.name} tabIndex={0} role="listitem">
                <strong>{c.name}</strong> {c.label && <span>({c.label})</span>} {c.parent && `→ ${c.parent}`}
                {c.comment && <div style={{ fontSize: "0.9em", color: "#555" }}>Comment: {c.comment}</div>}
              </li>
            ))}
          </ul>
        </div>
        <div className="ontology-section" tabIndex={0} aria-labelledby="properties-heading">
          <h2 id="properties-heading">Properties</h2>
          <PropertyForm
            propertyForm={propertyForm}
            classes={classes}
            onChange={handlePropertyChange}
            onSubmit={submitProperty}
          />
          <ul className="ontology-list" role="list" aria-label="Property List">
            {properties.map(p => (
              <li key={p.name} tabIndex={0} role="listitem">
                <strong>{p.name}</strong> [{p.type}]
                {p.label && <span> ({p.label})</span>}
                {p.comment && <div style={{ fontSize: "0.9em", color: "#555" }}>Comment: {p.comment}</div>}
              </li>
            ))}
          </ul>
        </div>
        <div className="ontology-section" tabIndex={0} aria-labelledby="constraint-heading">
          <h2 id="constraint-heading">Add Constraint</h2>
          <ConstraintForm
            constraintForm={constraintForm}
            classes={classes}
            properties={properties}
            onChange={handleConstraintChange}
            onSubmit={submitConstraint}
          />
        </div>
        <div className="ontology-section" tabIndex={0} aria-labelledby="export-heading">
          <h2 id="export-heading">Export / Import Ontology</h2>
          <button onClick={() => handleExport("turtle")} aria-label="Export ontology as Turtle format">Export as Turtle</button>
          <input type="file" accept=".ttl" onChange={handleImport} style={{ marginLeft: "1rem" }} aria-label="Import ontology Turtle file" />
        </div>
        <div style={{ position: "fixed", bottom: 20, left: 20, right: 20 }}>
          {message && <div className="ontology-message" role="status" aria-live="polite">{message}</div>}
        </div>
      </div>
    </>
  );
}

export default OntologyEditor;
