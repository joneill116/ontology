describe('Ontology Editor Smoke Test', () => {
  it('loads the login page', () => {
    cy.visit('/');
    cy.contains('Ontology Editor');
    cy.contains('Login');
  });
});
