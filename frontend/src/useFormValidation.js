import { useState } from "react";

/**
 * useFormValidation - shared hook for form validation and error handling
 * @param {Object} config - validation config: { fields, validators, duplicateCheck }
 * @returns {Object} { error, validate, setError }
 */
export default function useFormValidation(config) {
  const [error, setError] = useState("");

  // Validate all fields and run custom validators
  function validate(formData) {
    // Required fields
    for (const field of config.fields) {
      if (!formData[field] || (typeof formData[field] === "string" && !formData[field].trim())) {
        setError(config.messages.requiredFields || `${field} is required.`);
        return false;
      }
    }
    // Custom validators
    if (config.validators) {
      for (const [field, validator] of Object.entries(config.validators)) {
        const msg = validator(formData[field], formData);
        if (msg) {
          setError(msg);
          return false;
        }
      }
    }
    // Duplicate check
    if (config.duplicateCheck && config.duplicateCheck(formData)) {
      setError(config.messages.duplicateName || "Duplicate name.");
      return false;
    }
    setError("");
    return true;
  }

  return { error, validate, setError };
}
