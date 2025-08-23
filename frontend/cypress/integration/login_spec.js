describe('Login Flow', () => {
  it('shows error for invalid credentials', () => {
    cy.visit('/');
    cy.get('input[aria-label="Username"]').type('wronguser');
    cy.get('input[aria-label="Password"]').type('wrongpass');
    cy.get('button').contains('Login').click();
    cy.get('.error-notification').should('contain', 'Login failed');
  });
});
