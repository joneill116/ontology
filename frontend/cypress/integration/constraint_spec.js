describe('Constraint Creation', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('input[aria-label="Username"]').type('admin');
    cy.get('input[aria-label="Password"]').type('password');
    cy.get('button').contains('Login').click();
    cy.get('input[aria-label="Class Name"]').type('TestClass');
    cy.get('button').contains('Add Class').click();
    cy.get('input[aria-label="Property Name"]').type('TestProp');
    cy.get('select[aria-label="Property Type"]').select('object');
    cy.get('select[aria-label="Property Domain"]').select('TestClass');
    cy.get('select[aria-label="Property Range"]').select('TestClass');
    cy.get('button').contains('Add Property').click();
  });

  it('creates a new constraint', () => {
    cy.get('select[aria-label="Constraint Class"]').select('TestClass');
    cy.get('select[aria-label="Constraint Property"]').select('TestProp');
    cy.get('select[aria-label="Constraint Type"]').select('minCardinality');
    cy.get('input[aria-label="Constraint Value"]').type('1');
    cy.get('button').contains('Add Constraint').click();
    cy.contains('Constraint added successfully.');
  });
});
