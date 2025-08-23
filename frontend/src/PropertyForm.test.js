import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import PropertyForm from "./PropertyForm";

describe("PropertyForm", () => {
  const defaultProps = {
    propertyForm: {
      name: "",
      type: "",
      domain: "",
      range: "",
      label: "",
      comment: ""
    },
    classes: [{ name: "ClassA" }, { name: "ClassB" }],
    onChange: jest.fn(),
    onSubmit: jest.fn()
  };

  it("renders all fields and options", () => {
    render(<PropertyForm {...defaultProps} />);
    expect(screen.getByLabelText(/Property Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Property Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Property Domain/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Property Range/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Property Label/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Property Comment/i)).toBeInTheDocument();
  });

  it("shows error if required fields are missing", () => {
    render(<PropertyForm {...defaultProps} />);
    fireEvent.click(screen.getByText(/Add Property/i));
    expect(screen.getByRole("alert")).toHaveTextContent("All fields except label and comment are required.");
  });

  it("shows error if property name is duplicate", () => {
    const props = {
      ...defaultProps,
      propertyForm: { ...defaultProps.propertyForm, name: "ClassA", type: "object", domain: "ClassA", range: "ClassB" }
    };
    render(<PropertyForm {...props} />);
    fireEvent.click(screen.getByText(/Add Property/i));
    expect(screen.getByRole("alert")).toHaveTextContent("Property name already exists.");
  });

  it("shows 'No classes available' if classes is empty", () => {
    const props = { ...defaultProps, classes: [] };
    render(<PropertyForm {...props} />);
    expect(screen.getAllByText(/No classes available/i).length).toBe(2);
  });
});
