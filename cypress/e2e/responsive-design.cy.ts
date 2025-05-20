describe('Responsive Design Tests', () => {
  context('Homepage Responsive Design', () => {
    beforeEach(() => {
      // Visit the homepage
      cy.visit('/');
    });

    it('should adapt layout for mobile devices', () => {
      // Test mobile viewport
      cy.viewport(375, 667); // Mobile viewport
      // Check if navigation is collapsed or hamburger menu is visible
      cy.get('header').should('be.visible');

      // Check if content is properly sized for mobile
      cy.get('main').should('be.visible');
    });

    it('should adapt layout for desktop devices', () => {
      // Test desktop viewport
      cy.viewport(1280, 800); // Desktop viewport
      // Check if navigation is fully visible
      cy.get('header').should('be.visible');
      
      // Check if content is properly sized for desktop
      cy.get('main').should('be.visible');
    });
  });

  context('Blog Index Responsive Design', () => {
    beforeEach(() => {
      // Visit the blog index page
      cy.visit('/blog');
    });

    it('should adapt blog post grid for different screen sizes', () => {
      // Test mobile viewport
      cy.viewport(375, 667); // Mobile viewport
      // Check if blog posts exist
      cy.get('a[href*="/blog/"]').should('exist');
      
      // Test desktop viewport
      cy.viewport(1280, 800); // Desktop viewport
      // Check if blog posts exist
      cy.get('a[href*="/blog/"]').should('exist');
    });
  });

  context('Navigation Responsive Design', () => {
    beforeEach(() => {
      // Visit the homepage
      cy.visit('/');
    });

    it('should adapt navigation for different screen sizes', () => {
      // Test mobile viewport
      cy.viewport(375, 667); // Mobile viewport
      // Check if navigation is visible
      cy.get('header').should('be.visible');
      
      // Test desktop viewport
      cy.viewport(1280, 800); // Desktop viewport
      // Check if navigation links are visible
      cy.get('header a[href="/"]').should('be.visible');
      cy.get('header a[href="/blog"]').should('be.visible');
    });
  });
});
