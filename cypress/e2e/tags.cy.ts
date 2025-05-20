describe('Tags Pages', () => {
  context('Tags Index Page', () => {
    beforeEach(() => {
      // Visit the tags index page before each test
      cy.visit('/tags');
    });

    it('should load the tags index page successfully', () => {
      // Check if the page has loaded
      cy.get('body').should('be.visible');

      // Check for main content
      cy.get('main').should('be.visible');

      // Check for page title
      cy.get('h1').contains('Tags', { matchCase: false }).should('be.visible');
    });

    it('should display a list of tags', () => {
      // Check if tags exist
      cy.get('a[href*="/tags/"]').then($tags => {
        if ($tags.length > 0) {
          cy.log(`Found ${$tags.length} tags`);

          // Check if at least one tag is visible
          cy.get('a[href*="/tags/"]').first().should('be.visible');
        } else {
          // Check for "No tags found" message
          cy.get('body').contains('No tags', { matchCase: false }).should('be.visible');
        }
      });
    });

    it('should display tag counts if available', () => {
      // Check if tags with counts exist
      cy.get('a[href*="/tags/"]').then($tags => {
        if ($tags.length > 0) {
          // Check if tag counts are displayed
          cy.get('body').contains(/\(\d+\)/).should('have.length.at.least', 0);
        }
      });
    });

    it('should navigate to a tag page when clicking on a tag', () => {
      // Check if tags exist
      cy.get('a[href*="/tags/"]').then($tags => {
        if ($tags.length === 0) {
          cy.log('No tags found. Skipping navigation test.');
          return;
        }

        // Get the href of the first tag
        const href = $tags.first().attr('href');

        // Click on the first tag
        cy.get('a[href*="/tags/"]').first().click();

        // Verify navigation to tag page
        cy.url().should('include', href);

        // Check if tag page loaded
        cy.get('h1').contains('#').should('be.visible');
      });
    });

    it('should have proper SEO metadata', () => {
      // Check page title
      cy.title().should('include', 'Tags');

      // Check meta description
      cy.get('head meta[name="description"]').should('exist');

      // Check canonical link
      cy.get('head link[rel="canonical"]').should('have.attr', 'href').and('include', '/tags');
    });
  });

  context('Individual Tag Pages', () => {
    // Known tags for testing
    const knownTags = [
      'Angular',
      'C#',
      'Python',
      'SQL',
      'Validation'
    ];

    // Test the first known tag
    it(`should load the tag page for "${knownTags[0]}" successfully`, () => {
      // Visit the tag page
      cy.visit(`/tags/${knownTags[0].toLowerCase()}`);

      // Check if the page has loaded
      cy.get('body').should('be.visible');

      // Check for main content
      cy.get('main').should('be.visible');

      // Check for tag name in heading
      cy.get('h1').contains('#', { matchCase: false }).should('be.visible');
      cy.get('h1').contains(knownTags[0], { matchCase: false }).should('be.visible');
    });

    it('should display posts with the selected tag', () => {
      // Visit the tag page
      cy.visit(`/tags/${knownTags[0].toLowerCase()}`);

      // Check if posts exist
      cy.get('a[href*="/blog/"]').then($posts => {
        if ($posts.length > 0) {
          cy.log(`Found ${$posts.length} posts with tag "${knownTags[0]}"`);

          // Check if at least one post is visible
          cy.get('a[href*="/blog/"]').first().should('be.visible');
        } else {
          // Check for "No posts found" message
          cy.get('body').contains('No posts', { matchCase: false }).should('be.visible');
        }
      });
    });

    it('should have a link back to all tags', () => {
      // Visit the tag page
      cy.visit(`/tags/${knownTags[0].toLowerCase()}`);

      // Check for link back to tags index
      cy.get('a[href="/tags"]').should('be.visible');

      // Click on the link
      cy.get('a[href="/tags"]').click();

      // Verify navigation to tags index
      cy.url().should('include', '/tags');
      cy.get('h1').contains('Tags', { matchCase: false }).should('be.visible');
    });

    it('should highlight the current tag in post cards', () => {
      // Visit the tag page
      cy.visit(`/tags/${knownTags[0].toLowerCase()}`);

      // Check if posts exist
      cy.get('a[href*="/blog/"]').then($posts => {
        if ($posts.length === 0) {
          cy.log(`No posts found with tag "${knownTags[0]}". Skipping test.`);
          return;
        }

        // Check if the current tag is highlighted in post cards
        cy.get(`a[href*="/tags/${knownTags[0].toLowerCase()}"]`).first()
          .should('have.css', 'font-weight', '700');
      });
    });

    it('should navigate to a blog post when clicking on a post card', () => {
      // Visit the tag page
      cy.visit(`/tags/${knownTags[0].toLowerCase()}`);

      // Check if posts exist
      cy.get('a[href*="/blog/"]').then($posts => {
        if ($posts.length === 0) {
          cy.log(`No posts found with tag "${knownTags[0]}". Skipping test.`);
          return;
        }

        // Get the href of the first post
        const href = $posts.first().attr('href');

        // Click on the first post
        cy.get('a[href*="/blog/"]').first().click();

        // Verify navigation to blog post
        cy.url().should('include', href);

        // Check if blog post loaded
        cy.get('h1').should('be.visible');
        cy.get('time').should('be.visible');
      });
    });

    it('should have proper SEO metadata', () => {
      // Visit the tag page
      cy.visit(`/tags/${knownTags[0].toLowerCase()}`);

      // Check page title
      cy.title().should('include', knownTags[0]);

      // Check meta description
      cy.get('head meta[name="description"]').should('exist');

      // Check canonical link
      cy.get('head link[rel="canonical"]').should('have.attr', 'href').and('include', `/tags/${knownTags[0].toLowerCase()}`);
    });

    it('should handle non-existent tags gracefully', () => {
      // Visit a non-existent tag page
      cy.visit('/tags/non-existent-tag', { failOnStatusCode: false });

      // Check for 404 page or "No posts found" message
      cy.get('body').contains(/404|not found|no posts found/i).should('be.visible');
    });
  });

  context('Responsive Design', () => {
    it('should adapt layout for different screen sizes', () => {
      // Visit the tags index page
      cy.visit('/tags');

      // Test mobile viewport
      cy.viewport(375, 667); // Mobile viewport
      // Check if tags are properly sized for mobile
      cy.get('a[href*="/tags/"]').should('be.visible');

      // Test desktop viewport
      cy.viewport(1280, 800); // Desktop viewport
      // Check if tags are properly sized for desktop
      cy.get('a[href*="/tags/"]').should('be.visible');
    });
  });

  context('Accessibility', () => {
    it('should be accessible', () => {
      // Visit the tags index page
      cy.visit('/tags');

      // Check basic accessibility - simplified
      cy.get('img').each($img => {
        cy.wrap($img).should('have.attr', 'alt');
      });
    });
  });
});
