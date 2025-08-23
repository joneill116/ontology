import React from "react";
import PropTypes from "prop-types";
import "./ConstraintForm.css";

import React from "react";
import PropTypes from "prop-types";
import "./ConstraintForm.css";
import useFormValidation from "./useFormValidation";

  // i18n messages
  const messages = {
    addConstraint: "Add Constraint",
    constraintClass: "Constraint Class",
    constraintProperty: "Constraint Property",
    constraintType: "Constraint Type",
    constraintValue: "Constraint Value",
    selectClass: "Select Class",
    selectProperty: "Select Property",
    minCardinality: "Min Cardinality",
    maxCardinality: "Max Cardinality",
    exactCardinality: "Exact Cardinality",
    requiredFields: "All fields are required.",
    invalidValue: "Constraint value must be an integer between 0 and 1000.",
    failedAdd: "Failed to add constraint."
  };
  const errorId = "constraint-form-error";

  // Shared validation hook
  const { error, validate } = useFormValidation({
    fields: ["class", "property", "type", "value"],
    messages,
    validators: {
      value: value => {
        const valueInt = parseInt(value, 10);
        if (isNaN(valueInt) || valueInt < 0 || valueInt > 1000) return messages.invalidValue;
        return "";
      }
    }
  });

  // Helper to sanitize input
  const sanitize = value => {
    if (typeof value !== 'string') return '';
    return value.trim().replace(/[<>"]|'|`/g, '');
  };

  const errorRef = React.useRef(null);
  const handleSubmit = async e => {
    e.preventDefault();
    const sanitizedForm = {
      class: sanitize(constraintForm.class),
      property: sanitize(constraintForm.property),
      type: sanitize(constraintForm.type),
      value: constraintForm.value
    };
    if (!validate(sanitizedForm)) {
      // Focus error message for screen readers
      setTimeout(() => {
        if (errorRef.current) errorRef.current.focus();
      }, 0);
      return;
    }
    try {
      await Promise.resolve(onSubmit({ ...e, sanitizedForm }));
    } catch (err) {
      // Use error boundary/global error for unexpected errors
    }
  };

  return (
    <form onSubmit={handleSubmit} className="constraint-form" aria-label={messages.addConstraint} aria-describedby={error ? errorId : undefined} role="form">
      <select
        className="constraint-form__input"
        name="class"
        value={constraintForm.class}
        onChange={onChange}
        required
        aria-label={messages.constraintClass}
      >
        <option value="">{messages.selectClass}</option>
        {classes.map(c => (
          <option key={c.name} value={c.name}>{c.name}</option>
        ))}
      </select>
      <select
        className="constraint-form__input"
        name="property"
        value={constraintForm.property}
        onChange={onChange}
        required
        aria-label={messages.constraintProperty}
      >
        <option value="">{messages.selectProperty}</option>
        {properties.map(p => (
          <option key={p.name} value={p.name}>{p.name}</option>
        ))}
      </select>
      <select
        className="constraint-form__input"
        name="type"
        value={constraintForm.type}
        onChange={onChange}
        required
        aria-label={messages.constraintType}
      >
        <option value="minCardinality">{messages.minCardinality}</option>
        <option value="maxCardinality">{messages.maxCardinality}</option>
        <option value="exactCardinality">{messages.exactCardinality}</option>
      </select>
      <input
        className="constraint-form__input"
        name="value"
        type="number"
        min="0"
        max="1000"
        placeholder={messages.constraintValue}
        value={constraintForm.value}
        onChange={onChange}
        required
        aria-label={messages.constraintValue}
      />
      <button type="submit" className="constraint-form__input">{messages.addConstraint}</button>
      {error && (
        <div
          id={errorId}
          className="constraint-form__error"
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
// ...existing code...

ConstraintForm.propTypes = {
  constraintForm: PropTypes.shape({
    class: PropTypes.string.isRequired,
    property: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  }).isRequired,
  classes: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string.isRequired })
  ).isRequired,
  properties: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string.isRequired })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.string
};

export default ConstraintForm;
