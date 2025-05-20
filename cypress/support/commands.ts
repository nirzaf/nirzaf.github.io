// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Import the test data helper
import { getViewportSize } from './test-data';

// Declare global Cypress namespace to add custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to check if all images in the page are loaded
       * @example cy.checkAllImagesLoaded()
       */
      checkAllImagesLoaded(): Chainable<Element>;

      /**
       * Custom command to check if a blog post loads correctly
       * @example cy.checkBlogPost('my-blog-post-slug')
       */
      checkBlogPost(slug: string): Chainable<Element>;

      /**
       * Custom command to check navigation elements
       * @example cy.checkNavigation()
       */
      checkNavigation(): Chainable<Element>;

      /**
       * Custom command to check footer elements
       * @example cy.checkFooter()
       */
      checkFooter(): Chainable<Element>;

      /**
       * Custom command to check SEO metadata
       * @example cy.checkSEOMetadata('Page Title', 'Page Description')
       */
      checkSEOMetadata(title: string, description?: string): Chainable<Element>;

      /**
       * Custom command to check theme toggle functionality
       * @example cy.checkThemeToggle()
       */
      checkThemeToggle(): Chainable<Element>;

      /**
       * Custom command to check post card elements
       * @example cy.checkPostCard()
       */
      checkPostCard(): Chainable<Element>;

      /**
       * Custom command to test responsive behavior
       * @example cy.testResponsive('mobile', () => { cy.get('nav').should('not.be.visible') })
       */
      testResponsive(viewport: string, testFunction: () => void): Chainable<Element>;

      /**
       * Custom command to check accessibility of a page
       * @example cy.checkA11y()
       */
      checkA11y(): Chainable<Element>;

      /**
       * Custom command to test search functionality
       * @example cy.testSearch('nextjs')
       */
      testSearch(query: string): Chainable<Element>;
    }
  }
}

// Custom command to check if all images in the page are loaded
Cypress.Commands.add('checkAllImagesLoaded', () => {
  cy.get('img').each(($img) => {
    cy.wrap($img).should('be.visible');
    cy.wrap($img).should('have.attr', 'src');

    // Check if image has alt text
    cy.wrap($img).should('have.attr', 'alt');
  });
});

// Custom command to check if a blog post loads correctly
Cypress.Commands.add('checkBlogPost', (slug: string) => {
  cy.visit(`/blog/${slug}`);

  // Wait for content to load
  cy.get('h1').should('be.visible');

  // Check for main content container
  cy.get('.prose').should('exist');

  // Check for post metadata
  cy.get('time').should('exist'); // Date
  cy.get('h1').contains(slug.split('-').join(' '), { matchCase: false }); // Title should somewhat match slug

  // Check images
  cy.checkAllImagesLoaded();

  // Check for error messages
  cy.get('body').should('not.contain', 'Error:');
  cy.get('body').should('not.contain', '404');
});

// Custom command to check navigation elements
Cypress.Commands.add('checkNavigation', () => {
  // Check header exists
  cy.get('header').should('be.visible');

  // Check navigation links
  cy.get('header a[href="/"]').should('be.visible');
  cy.get('header a[href="/blog"]').should('be.visible');
  cy.get('header a[href="/about"]').should('be.visible');

  // Check logo/site title
  cy.get('header').contains('My Blog').should('be.visible');
});

// Custom command to check footer elements
Cypress.Commands.add('checkFooter', () => {
  // Check footer exists
  cy.get('footer').should('be.visible');

  // Check copyright text
  cy.get('footer').contains('©').should('be.visible');

  // Check social links if they exist
  cy.get('footer a').should('have.length.at.least', 1);
});

// Custom command to check SEO metadata
Cypress.Commands.add('checkSEOMetadata', (title: string, description?: string) => {
  // Check page title
  cy.title().should('include', title);

  // Check meta description if provided
  if (description) {
    cy.get('head meta[name="description"]').should('have.attr', 'content').and('include', description);
  }
});

// Custom command to check theme toggle functionality
Cypress.Commands.add('checkThemeToggle', () => {
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

// Custom command to check post card elements
Cypress.Commands.add('checkPostCard', () => {
  cy.get('article').first().within(() => {
    // Check for title
    cy.get('h2, h3').should('be.visible');

    // Check for link to post
    cy.get('a[href*="/blog/"]').should('be.visible');

    // Check for date
    cy.get('time').should('be.visible');

    // Check for description/excerpt
    cy.get('p').should('be.visible');

    // Check for tags if they exist
    cy.get('a[href*="/tags/"]').should('have.length.at.least', 0);
  });
});

// Custom command to test responsive behavior
Cypress.Commands.add('testResponsive', (viewport: string, testFunction: () => void) => {
  // Get viewport dimensions from test data
  const viewportName = viewport as 'mobile' | 'tablet' | 'desktop' | 'largeDesktop';
  const { width, height } = getViewportSize(viewportName);

  // Set viewport
  cy.viewport(width, height);

  // Run test function
  testFunction();

  // Reset viewport
  cy.viewport(1280, 800);
});

// Custom command to check accessibility
Cypress.Commands.add('checkA11y', () => {
  // Basic accessibility checks

  // Check for alt text on images
  cy.get('img').each($img => {
    cy.wrap($img).should('have.attr', 'alt');
  });

  // Check for proper heading hierarchy
  cy.get('h1').should('have.length', 1); // Only one h1 per page

  // Check for proper link text (no "click here")
  cy.get('a').each($a => {
    cy.wrap($a).invoke('text').then(text => {
      const linkText = text.trim().toLowerCase();
      expect(linkText).not.to.be.oneOf(['click here', 'here', 'link']);
    });
  });
});

// Custom command to test search functionality
Cypress.Commands.add('testSearch', (query: string) => {
  // Test header search
  cy.get('header input[placeholder*="Search"]').should('be.visible').type(query);

  // Wait for search results dropdown
  cy.wait(500);

  // Check if dropdown appears
  cy.get('body').then($body => {
    const hasDropdown = $body.find('div[class*="absolute"] a[href*="/blog/"]').length > 0;

    if (hasDropdown) {
      // Check if results are visible
      cy.get('div[class*="absolute"] a[href*="/blog/"]').first().should('be.visible');
    } else {
      // Check for no results message
      cy.get('div[class*="absolute"]').contains('No results').should('be.visible');
    }
  });

  // Clear the search
  cy.get('header input[placeholder*="Search"]').clear();

  // Test search page
  cy.visit(`/search?q=${encodeURIComponent(query)}`);

  // Check if search input has the query
  cy.get('input[placeholder*="Search"]').should('have.value', query);

  // Wait for results to load
  cy.wait(1000);

  // Check results or no results message
  cy.get('body').then($body => {
    if ($body.find('a[href*="/blog/"]').length > 0) {
      // If results exist, check if they're visible
      cy.get('a[href*="/blog/"]').should('be.visible');
    } else {
      // If no results, check for no results message
      cy.contains('No results found').should('be.visible');
    }
  });
});

// Export an empty object to make TypeScript happy
export {};
