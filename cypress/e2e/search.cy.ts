describe('Search Functionality', () => {
  beforeEach(() => {
    // Visit the homepage before each test
    cy.visit('/');
  });

  it('should have search bar on homepage', () => {
    // Check if search bar exists
    cy.get('input[placeholder*="Search"]').should('be.visible');
  });

  it('should have search bar in header on all pages', () => {
    // Check homepage
    cy.get('header input[placeholder*="Search"]').should('exist');

    // Check blog page
    cy.visit('/blog');
    cy.get('header input[placeholder*="Search"]').should('exist');

    // Check about page
    cy.visit('/about');
    cy.get('header input[placeholder*="Search"]').should('exist');
  });

  it('should navigate to search page when submitting search', () => {
    // Type in search query
    cy.get('input[placeholder*="Search"]').first().type('test{enter}');

    // Verify navigation to search page
    cy.url().should('include', '/search?q=test');
    cy.get('h1').contains('Search Results').should('be.visible');
  });

  it('should show search results for valid query', () => {
    // Use our custom search test command
    cy.testSearch('nextjs');
  });

  it('should show empty state for search with no query', () => {
    // Visit search page without query
    cy.visit('/search');

    // Check for empty state message
    cy.contains('Enter a search term').should('be.visible');
  });

  it('should show dropdown results when typing in header search', () => {
    // Type in header search
    cy.get('header input[placeholder*="Search"]').type('test');

    // Wait for dropdown to appear
    cy.wait(500);

    // Check if dropdown is visible
    cy.get('header').parent().find('div[class*="absolute"]').should('exist');
  });
});
