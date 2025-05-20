describe('Homepage', () => {
  beforeEach(() => {
    // Visit the homepage before each test
    cy.visit('/');
  });

  it('should load the homepage successfully', () => {
    // Check if the page has loaded
    cy.get('body').should('be.visible');

    // Check for main content
    cy.get('main').should('be.visible');
  });

  it('should display a welcome message or hero section', () => {
    // Check for a heading or welcome message
    cy.get('h1, h2').should('be.visible');

    // Check for a description or intro text
    cy.get('p').should('be.visible');
  });

  it('should have a call-to-action button or link to blog posts', () => {
    // Check for a CTA button or link to blog posts
    cy.get('a[href="/blog"]').should('be.visible');
  });

  it('should navigate to blog index when clicking "View All Posts" button', () => {
    // Find and click the "View All Posts" button
    cy.get('a[href="/blog"]').contains('Posts', { matchCase: false }).click();

    // Verify navigation to blog index
    cy.url().should('include', '/blog');
    cy.get('h1').contains('Blog', { matchCase: false }).should('be.visible');
  });

  it('should display featured blog post if available', () => {
    // Check if there is a featured blog post
    cy.get('h2').contains('Featured Post').should('be.visible');
    cy.get('a[href*="/blog/"]').then($links => {
      if ($links.length > 0) {
        // Check if post title is visible
        cy.get('a[href*="/blog/"]').first().should('be.visible');
      } else {
        // Skip this test if no featured post
        cy.log('No featured blog post found on homepage');
      }
    });
  });

  it('should display recent blog posts if available', () => {
    // Check if there are recent blog posts
    cy.get('h2').contains('Recent Posts').should('be.visible');
    cy.get('.grid a[href*="/blog/"]').then($links => {
      if ($links.length > 0) {
        // Check if post titles are visible
        cy.get('.grid a[href*="/blog/"]').first().should('be.visible');
        // Check if we have multiple posts (up to 6, since the first one is featured)
        cy.get('.grid a[href*="/blog/"]').should('have.length.lessThan', 7);
      } else {
        // Skip this test if no recent posts
        cy.log('No recent blog posts found on homepage');
      }
    });
  });

  it('should have proper SEO metadata', () => {
    // Check page title
    cy.title().should('not.be.empty');

    // Check meta description
    cy.get('head meta[name="description"]').should('exist');

    // Check canonical link
    cy.get('head link[rel="canonical"]').should('have.attr', 'href');
  });

  it('should load images properly', () => {
    // Check if images exist
    cy.get('img').then($imgs => {
      if ($imgs.length > 0) {
        // Check each image
        cy.get('img').each($img => {
          // Check if image is visible
          cy.wrap($img).should('be.visible');

          // Check if image has src attribute
          cy.wrap($img).should('have.attr', 'src');

          // Check if image has alt attribute
          cy.wrap($img).should('have.attr', 'alt');
        });
      } else {
        // Skip this test if no images
        cy.log('No images found on homepage');
      }
    });
  });

  it('should be accessible', () => {
    // Check basic accessibility
    cy.checkA11y();
  });

  it('should adapt to different screen sizes', () => {
    // Test responsive behavior
    cy.testResponsive('mobile', () => {
      // Check if content is visible on mobile
      cy.get('main').should('be.visible');
      cy.get('h1, h2').should('be.visible');
    });

    cy.testResponsive('tablet', () => {
      // Check if content is visible on tablet
      cy.get('main').should('be.visible');
      cy.get('h1, h2').should('be.visible');
    });

    cy.testResponsive('desktop', () => {
      // Check if content is visible on desktop
      cy.get('main').should('be.visible');
      cy.get('h1, h2').should('be.visible');
    });
  });
});
