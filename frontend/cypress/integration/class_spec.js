describe('Class Creation', () => {
  beforeEach(() => {
    cy.visit('/');
    // Login with valid credentials (replace with actual test user)
    cy.get('input[aria-label="Username"]').type('admin');
    cy.get('input[aria-label="Password"]').type('password');
    cy.get('button').contains('Login').click();
  });

  it('creates a new class', () => {
    cy.get('input[aria-label="Class Name"]').type('TestClass');
    cy.get('button').contains('Add Class').click();
    cy.contains('TestClass');
  });
});
