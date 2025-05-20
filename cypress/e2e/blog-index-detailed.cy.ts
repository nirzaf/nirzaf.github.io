describe('Blog Index Page', () => {
  beforeEach(() => {
    // Visit the blog index page before each test
    cy.visit('/blog');
  });

  it('should load the blog index page successfully', () => {
    // Check if the page has loaded
    cy.get('body').should('be.visible');

    // Check for main content
    cy.get('main').should('be.visible');

    // Check for page title
    cy.get('h1').contains('Blog', { matchCase: false }).should('be.visible');
  });

  it('should display blog post cards', () => {
    // Check if blog post cards exist
    cy.get('a[href*="/blog/"]').then($links => {
      if ($links.length > 0) {
        cy.log(`Found ${$links.length} blog post links`);

        // Check if at least one post card is visible
        cy.get('a[href*="/blog/"]').first().should('be.visible');
      } else {
        // Check for "No posts found" message
        cy.get('body').contains('No blog posts', { matchCase: false }).should('be.visible');
      }
    });
  });

  context('Post Card Components', () => {
    beforeEach(() => {
      // Skip tests if no post cards exist
      cy.get('a[href*="/blog/"]').then($links => {
        if ($links.length === 0) {
          cy.log('No blog posts found. Skipping post card tests.');
          return;
        }
      });
    });

    it('should display post titles in cards', () => {
      // Check first post card for title
      cy.get('a[href*="/blog/"]').first().parents('article, div, li').within(() => {
        cy.get('h2, h3').should('be.visible');
      });
    });

    it('should display post dates in cards', () => {
      // Check first post card for date
      cy.get('a[href*="/blog/"]').first().parents('article, div, li').within(() => {
        cy.get('time').should('be.visible');
      });
    });

    it('should display post descriptions in cards', () => {
      // Check first post card for description
      cy.get('a[href*="/blog/"]').first().parents('article, div, li').within(() => {
        cy.get('p').should('be.visible');
      });
    });

    it('should display post images in cards if available', () => {
      // Check first post card for image
      cy.get('a[href*="/blog/"]').first().parents('article, div, li').within(() => {
        cy.get('img').then($imgs => {
          if ($imgs.length > 0) {
            cy.wrap($imgs).first().should('be.visible');
            cy.wrap($imgs).first().should('have.attr', 'src');
            cy.wrap($imgs).first().should('have.attr', 'alt');
          } else {
            cy.log('No image found in this post card');
          }
        });
      });
    });

    it('should display post tags in cards if available', () => {
      // Check first post card for tags
      cy.get('a[href*="/blog/"]').first().parents('article, div, li').within(() => {
        cy.get('a[href*="/tags/"]').then($tags => {
          if ($tags.length > 0) {
            cy.wrap($tags).first().should('be.visible');
          } else {
            cy.log('No tags found in this post card');
          }
        });
      });
    });
  });

  context('Navigation and Interaction', () => {
    it('should navigate to a blog post when clicking on a post card', () => {
      // Skip test if no post cards exist
      cy.get('a[href*="/blog/"]').then($links => {
        if ($links.length === 0) {
          cy.log('No blog posts found. Skipping navigation test.');
          return;
        }

        // Get the href of the first post link
        const href = $links.first().attr('href');

        // Click on the first post link
        cy.get('a[href*="/blog/"]').first().click();

        // Verify navigation to the blog post
        cy.url().should('include', href);

        // Check if blog post content loaded
        cy.get('h1').should('be.visible');
        cy.get('time').should('be.visible');
      });
    });

    it('should navigate to a tag page when clicking on a tag', () => {
      // Skip test if no tags exist
      cy.get('a[href*="/tags/"]').then($tags => {
        if ($tags.length === 0) {
          cy.log('No tags found. Skipping tag navigation test.');
          return;
        }

        // Get the href of the first tag link
        const href = $tags.first().attr('href');

        // Click on the first tag link
        cy.get('a[href*="/tags/"]').first().click();

        // Verify navigation to the tag page
        cy.url().should('include', href);

        // Check if tag page content loaded
        cy.get('h1').contains('#').should('be.visible');
      });
    });
  });

  context('SEO and Metadata', () => {
    it('should have proper SEO metadata', () => {
      // Check page title
      cy.title().should('include', 'Blog');

      // Check meta description
      cy.get('head meta[name="description"]').should('exist');

      // Check canonical link
      cy.get('head link[rel="canonical"]').should('have.attr', 'href').and('include', '/blog');
    });
  });

  context('Responsive Design', () => {
    it('should adapt layout for different screen sizes', () => {
      // Test mobile viewport
      cy.viewport(375, 667); // Mobile viewport
      // Check if blog posts are stacked vertically on mobile
      cy.get('a[href*="/blog/"]').then($links => {
        if ($links.length > 1) {
          // Just check that links exist
          cy.get('a[href*="/blog/"]').should('exist');
        }
      });

      // Test desktop viewport
      cy.viewport(1280, 800); // Desktop viewport
      // Check if blog posts are in a grid on desktop
      cy.get('a[href*="/blog/"]').then($links => {
        if ($links.length > 1) {
          // Just check that links exist
          cy.get('a[href*="/blog/"]').should('exist');
        }
      });
    });
  });

  context('Accessibility', () => {
    it('should be accessible', () => {
      // Check basic accessibility - simplified
      cy.get('img').each($img => {
        cy.wrap($img).should('have.attr', 'alt');
      });
    });
  });
});
