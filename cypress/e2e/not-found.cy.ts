describe('Not Found (404) Page', () => {
  beforeEach(() => {
    // Visit a non-existent page
    cy.visit('/this-page-does-not-exist', { failOnStatusCode: false });
  });

  it('should display the 404 page for non-existent routes', () => {
    // Check if the page has loaded
    cy.get('body').should('be.visible');
    
    // Check for 404 message
    cy.get('body').contains(/404|not found|page not found/i).should('be.visible');
  });

  it('should have a link back to the homepage', () => {
    // Check for link to homepage using data-cy attribute
    cy.get('[data-cy="home-link"]').should('be.visible');
    
    // Click on the link
    cy.get('[data-cy="home-link"]').click();
    
    // Verify navigation to homepage
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('should have proper SEO metadata', () => {
    // Check page title
    cy.title().should('include', '404');
    
    // Check meta description
    cy.get('head meta[name="description"]').should('exist');
  });

  context('Responsive Design', () => {
    it('should adapt layout for different screen sizes', () => {
      // Test mobile viewport
      cy.testResponsive('mobile', () => {
        // Check if content is properly sized for mobile
        cy.get('body').contains(/404|not found|page not found/i).should('be.visible');
      });
      
      // Test desktop viewport
      cy.testResponsive('desktop', () => {
        // Check if content is properly sized for desktop
        cy.get('body').contains(/404|not found|page not found/i).should('be.visible');
      });
    });
  });

  context('Accessibility', () => {
    it('should be accessible', () => {
      // Check basic accessibility
      cy.checkA11y();
    });
  });
});
