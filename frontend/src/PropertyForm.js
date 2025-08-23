/**
 * PropertyForm component for adding ontology properties.
 * @param {Object} props
 * @param {Object} props.propertyForm - The property form state object.
 * @param {Array} props.classes - List of available classes.
 * @param {Function} props.onChange - Handler for input changes.
 * @param {Function} props.onSubmit - Handler for form submission.
 */
import React from "react";
import PropTypes from "prop-types";
import "./PropertyForm.css";
import useFormValidation from "./useFormValidation";

  // i18n messages
  const messages = {
    addProperty: "Add Property",
    propertyName: "Property Name",
    propertyType: "Property Type",
    propertyDomain: "Property Domain",
    propertyRange: "Property Range",
    propertyLabel: "Property Label",
    propertyComment: "Property Comment",
    selectType: "Select Type",
    selectDomain: "Select Domain",
    selectRange: "Select Range",
    object: "Object",
    data: "Data",
    noClasses: "No classes available",
    requiredFields: "All fields except label and comment are required.",
    duplicateName: "Property name already exists.",
    failedAdd: "Failed to add property."
  };
  const errorId = "property-form-error";

  // Shared validation hook
  const { error, validate } = useFormValidation({
    fields: ["name", "type", "domain", "range"],
    messages,
    validators: {
      name: name => {
        if (name.length < 2 || name.length > 50) return "Property name must be 2-50 characters, alphanumeric or underscore, no spaces.";
        if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) return "Property name must be 2-50 characters, alphanumeric or underscore, no spaces.";
        return "";
      }
    },
    duplicateCheck: form => classes.some(c => c.name === form.name)
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
      name: sanitize(propertyForm.name),
      type: sanitize(propertyForm.type),
      domain: sanitize(propertyForm.domain),
      range: sanitize(propertyForm.range),
      label: sanitize(propertyForm.label),
      comment: sanitize(propertyForm.comment)
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
    <form onSubmit={handleSubmit} className="property-form" aria-label={messages.addProperty} aria-describedby={error ? errorId : undefined} role="form">
      <input
        className="property-form__input"
        name="name"
        placeholder={messages.propertyName}
        value={propertyForm.name}
        onChange={onChange}
        required
        aria-label={messages.propertyName}
        aria-describedby={error ? errorId : undefined}
      />
      <select
        className="property-form__input"
        name="type"
        value={propertyForm.type}
        onChange={onChange}
        required
        aria-label={messages.propertyType}
      >
        <option value="">{messages.selectType}</option>
        <option value="object">{messages.object}</option>
        <option value="data">{messages.data}</option>
      </select>
      <select
        className="property-form__input"
        name="domain"
        value={propertyForm.domain}
        onChange={onChange}
        required
        aria-label={messages.propertyDomain}
      >
        <option value="">{messages.selectDomain}</option>
        {classes.length === 0 ? (
          <option value="" disabled>{messages.noClasses}</option>
        ) : (
          classes.map(c => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))
        )}
      </select>
      <select
        className="property-form__input"
        name="range"
        value={propertyForm.range}
        onChange={onChange}
        required
        aria-label={messages.propertyRange}
      >
        <option value="">{messages.selectRange}</option>
        {classes.length === 0 ? (
          <option value="" disabled>{messages.noClasses}</option>
        ) : (
          classes.map(c => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))
        )}
      </select>
      <input
        className="property-form__input"
        name="label"
        placeholder={messages.propertyLabel}
        value={propertyForm.label}
        onChange={onChange}
        aria-label={messages.propertyLabel}
      />
      <input
        className="property-form__input"
        name="comment"
        placeholder={messages.propertyComment}
        value={propertyForm.comment}
        onChange={onChange}
        aria-label={messages.propertyComment}
      />
      <button type="submit" className="property-form__input">{messages.addProperty}</button>
      {error && (
        <div
          id={errorId}
          className="property-form__error"
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


PropertyForm.propTypes = {
  propertyForm: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    range: PropTypes.string.isRequired,
    label: PropTypes.string,
    comment: PropTypes.string
  }).isRequired,
  classes: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string.isRequired })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};
