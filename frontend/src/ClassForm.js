import React from "react";
import PropTypes from "prop-types";
import "./ClassForm.css";

import React from "react";
import PropTypes from "prop-types";
import "./ClassForm.css";
import useFormValidation from "./useFormValidation";

  // i18n messages
  const messages = {
    addClass: "Add Class",
    className: "Class Name",
    classLabel: "Class Label",
    classComment: "Class Comment",
    parentClass: "Parent Class",
    noParent: "No Parent",
    requiredFields: "Class name is required.",
    invalidName: "Class name must be 2-50 characters, alphanumeric or underscore, no spaces.",
    duplicateName: "Class name already exists.",
    failedAdd: "Failed to add class."
  };
  const errorId = "class-form-error";

  // Shared validation hook
  const { error, validate } = useFormValidation({
    fields: ["name"],
    messages,
    validators: {
      name: name => {
        if (name.length < 2 || name.length > 50) return messages.invalidName;
        if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) return messages.invalidName;
        return "";
      }
    },
    duplicateCheck: form => classes.some(c => c.name === form.name)
  });

  // Helper to sanitize input
  const sanitize = value => {
    if (typeof value !== 'string') return '';
    return value.trim().replace(/[<>"']|`/g, '');
  };

  const errorRef = React.useRef(null);
  const handleSubmit = async e => {
    e.preventDefault();
    const sanitizedForm = {
      name: sanitize(classForm.name),
      label: sanitize(classForm.label),
      comment: sanitize(classForm.comment),
      parent: sanitize(classForm.parent)
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
    <form onSubmit={handleSubmit} className="class-form" aria-label={messages.addClass} aria-describedby={error ? errorId : undefined} role="form">
      <input
        className="class-form__input"
        name="name"
        placeholder={messages.className}
        value={classForm.name}
        onChange={onChange}
        required
        aria-label={messages.className}
        aria-describedby={error ? errorId : undefined}
      />
      <input
        className="class-form__input"
        name="label"
        placeholder={messages.classLabel}
        value={classForm.label}
        onChange={onChange}
        aria-label={messages.classLabel}
      />
      <input
        className="class-form__input"
        name="comment"
        placeholder={messages.classComment}
        value={classForm.comment}
        onChange={onChange}
        aria-label={messages.classComment}
      />
      <select
        className="class-form__input"
        name="parent"
        value={classForm.parent}
        onChange={onChange}
        aria-label={messages.parentClass}
      >
        <option value="">{messages.noParent}</option>
        {classes.map(c => (
          <option key={c.name} value={c.name}>{c.name}</option>
        ))}
      </select>
      <button type="submit" className="class-form__input">{messages.addClass}</button>
      {error && (
        <div
          id={errorId}
          className="class-form__error"
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

ClassForm.propTypes = {
  classForm: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    comment: PropTypes.string,
    parent: PropTypes.string
  }).isRequired,
  classes: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string.isRequired })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.string
};

export default ClassForm;
