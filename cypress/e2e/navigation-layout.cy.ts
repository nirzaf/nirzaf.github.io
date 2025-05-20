describe('Navigation and Layout', () => {
  beforeEach(() => {
    // Visit the homepage before each test
    cy.visit('/');
  });

  context('Header and Navigation', () => {
    it('should display the header with navigation links', () => {
      // Check header exists
      cy.get('header').should('be.visible');

      // Check navigation links
      cy.get('header a[href="/"]').should('be.visible');
      cy.get('header a[href="/blog"]').should('be.visible');
      cy.get('header a[href="/about"]').should('be.visible');
    });

    it('should navigate to correct pages when clicking navigation links', () => {
      // Click on Blog link and verify navigation
      cy.get('header a[href="/blog"]').click();
      cy.url().should('include', '/blog');
      cy.get('h1').contains('Blog', { matchCase: false }).should('be.visible');

      // Click on About link and verify navigation
      cy.get('header a[href="/about"]').click();
      cy.url().should('include', '/about');
      cy.get('h1').contains('About', { matchCase: false }).should('be.visible');

      // Click on Home/Logo link and verify navigation
      cy.get('header a[href="/"]').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('should have a logo or site title that links to homepage', () => {
      // Find logo or site title
      cy.get('header').contains('Blog', { matchCase: false }).click();

      // Verify navigation to homepage
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });

  context('Footer', () => {
    it('should display the footer with copyright information', () => {
      // Check footer exists
      cy.get('footer').should('be.visible');

      // Check copyright text
      cy.get('footer').contains('©').should('be.visible');
    });

    it('should have social media links in the footer', () => {
      // Check for social media links
      cy.get('footer a').should('have.length.at.least', 1);
    });
  });

  context('Theme Toggle', () => {
    it('should toggle between light and dark themes', () => {
      // Find theme toggle button
      cy.get('button[aria-label*="theme"], button[aria-label*="Theme"], button[aria-label*="mode"], button[aria-label*="Mode"]')
        .as('themeToggle')
        .should('exist');

      // Get initial theme
      cy.get('html').then($html => {
        const initialTheme = $html.hasClass('dark') ? 'dark' : 'light';

        // Click theme toggle
        cy.get('@themeToggle').click();

        // Check if theme changed
        if (initialTheme === 'dark') {
          cy.get('html').should('not.have.class', 'dark');
        } else {
          cy.get('html').should('have.class', 'dark');
        }

        // Reset theme
        cy.get('@themeToggle').click();
      });
    });

    it('should persist theme preference', () => {
      // Find theme toggle button
      cy.get('button[aria-label*="theme"], button[aria-label*="Theme"], button[aria-label*="mode"], button[aria-label*="Mode"]')
        .as('themeToggle')
        .should('exist');

      // Get initial theme
      cy.get('html').then($html => {
        const initialTheme = $html.hasClass('dark') ? 'dark' : 'light';

        // Click theme toggle to change theme
        cy.get('@themeToggle').click();

        // Reload page
        cy.reload();

        // Check if theme persisted
        if (initialTheme === 'dark') {
          cy.get('html').should('not.have.class', 'dark');
        } else {
          cy.get('html').should('have.class', 'dark');
        }

        // Reset theme
        cy.get('@themeToggle').click();
      });
    });
  });

  context('Responsive Layout', () => {
    it('should adapt layout for mobile devices', () => {
      // Test mobile viewport
      cy.testResponsive('mobile', () => {
        // Check if navigation is collapsed or hamburger menu is visible
        cy.get('header').should('be.visible');

        // Check if content is properly sized for mobile
        cy.get('main').should('be.visible');
        cy.get('main').invoke('width').should('be.lessThan', 500);
      });
    });

    it('should adapt layout for tablet devices', () => {
      // Test tablet viewport
      cy.testResponsive('tablet', () => {
        // Check if navigation is visible
        cy.get('header').should('be.visible');

        // Check if content is properly sized for tablet
        cy.get('main').should('be.visible');
        cy.get('main').invoke('width').should('be.within', 500, 900);
      });
    });

    it('should adapt layout for desktop devices', () => {
      // Test desktop viewport
      cy.testResponsive('desktop', () => {
        // Check if navigation is fully visible
        cy.get('header').should('be.visible');

        // Check if content is properly sized for desktop
        cy.get('main').should('be.visible');
        cy.get('main').invoke('width').should('be.greaterThan', 900);
      });
    });
  });
});
