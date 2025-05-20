describe('About Page', () => {
  beforeEach(() => {
    // Visit the about page before each test
    cy.visit('/about');
  });

  it('should load the about page successfully', () => {
    // Check if the page has loaded
    cy.get('body').should('be.visible');
    
    // Check for main content
    cy.get('main').should('be.visible');
    
    // Check for page title
    cy.get('h1').contains('About', { matchCase: false }).should('be.visible');
  });

  it('should display about content sections', () => {
    // Check for content sections
    cy.get('h2, h3').should('have.length.at.least', 1);
    
    // Check for paragraphs
    cy.get('p').should('have.length.at.least', 1);
  });

  it('should display contact information if available', () => {
    // Check for contact section
    cy.get('body').contains(/contact|email|get in touch/i).then($contact => {
      if ($contact.length > 0) {
        // Check for email link
        cy.get('a[href^="mailto:"]').should('have.length.at.least', 0);
      } else {
        cy.log('No contact section found');
      }
    });
  });

  it('should display social media links if available', () => {
    // Check for social media links
    cy.get('a[href*="twitter.com"], a[href*="github.com"], a[href*="linkedin.com"]').should('have.length.at.least', 0);
  });

  it('should display images correctly if available', () => {
    // Check for images
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
        cy.log('No images found on about page');
      }
    });
  });

  it('should have proper SEO metadata', () => {
    // Check page title
    cy.title().should('include', 'About');
    
    // Check meta description
    cy.get('head meta[name="description"]').should('exist');
    
    // Check canonical link
    cy.get('head link[rel="canonical"]').should('have.attr', 'href').and('include', '/about');
  });

  context('Navigation', () => {
    it('should have working links to other pages', () => {
      // Check for links to other pages
      cy.get('a[href="/"], a[href="/blog"], a[href="/tags"]').should('have.length.at.least', 1);
    });

    it('should have working external links if available', () => {
      // Check for external links
      cy.get('a[href^="http"]').then($links => {
        if ($links.length > 0) {
          // Check if external links have target="_blank" and rel="noopener noreferrer"
          cy.get('a[href^="http"]').first().should('have.attr', 'target', '_blank');
          cy.get('a[href^="http"]').first().should('have.attr', 'rel').and('include', 'noopener');
        } else {
          cy.log('No external links found');
        }
      });
    });
  });

  context('Responsive Design', () => {
    it('should adapt layout for different screen sizes', () => {
      // Test mobile viewport
      cy.testResponsive('mobile', () => {
        // Check if content is properly sized for mobile
        cy.get('main').should('be.visible');
        cy.get('main').invoke('width').should('be.lessThan', 500);
      });
      
      // Test desktop viewport
      cy.testResponsive('desktop', () => {
        // Check if content is properly sized for desktop
        cy.get('main').should('be.visible');
        cy.get('main').invoke('width').should('be.greaterThan', 500);
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
