describe('Property Creation', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('input[aria-label="Username"]').type('admin');
    cy.get('input[aria-label="Password"]').type('password');
    cy.get('button').contains('Login').click();
    cy.get('input[aria-label="Class Name"]').type('TestClass');
    cy.get('button').contains('Add Class').click();
  });

  it('creates a new property', () => {
    cy.get('input[aria-label="Property Name"]').type('TestProp');
    cy.get('select[aria-label="Property Type"]').select('object');
    cy.get('select[aria-label="Property Domain"]').select('TestClass');
    cy.get('select[aria-label="Property Range"]').select('TestClass');
    cy.get('button').contains('Add Property').click();
    cy.contains('TestProp');
  });
});
