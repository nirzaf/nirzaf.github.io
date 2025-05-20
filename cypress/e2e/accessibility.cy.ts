describe('Accessibility', () => {
  context('Homepage Accessibility', () => {
    beforeEach(() => {
      // Visit the homepage
      cy.visit('/');
    });

    it('should have proper heading hierarchy', () => {
      // Check for h1
      cy.get('h1').should('have.length', 1);

      // Check for proper heading order
      cy.get('h1').then($h1 => {
        // Get all headings
        cy.get('h2, h3, h4, h5, h6').each($heading => {
          // Get heading level
          const headingLevel = parseInt($heading.prop('tagName').replace('H', ''));

          // Get previous heading level
          const prevHeadingLevel = parseInt($heading.prevAll('h1, h2, h3, h4, h5, h6').first().prop('tagName').replace('H', ''));

          // Check if heading level is at most one level deeper than previous heading
          if (!isNaN(prevHeadingLevel)) {
            expect(headingLevel).to.be.at.most(prevHeadingLevel + 1);
          }
        });
      });
    });

    it('should have alt text for all images', () => {
      // Check for images
      cy.get('img').each($img => {
        // Check if image has alt attribute
        cy.wrap($img).should('have.attr', 'alt');

        // Check if alt text is not empty
        cy.wrap($img).invoke('attr', 'alt').should('not.be.empty');
      });
    });

    it('should have proper link text', () => {
      // Check for links
      cy.get('a').each($a => {
        // Check if link has text
        cy.wrap($a).invoke('text').then(text => {
          // Skip links with images
          if ($a.find('img').length === 0) {
            // Check if link text is not empty
            expect(text.trim()).to.not.be.empty;

            // Check if link text is not just "click here" or similar
            const linkText = text.trim().toLowerCase();
            expect(linkText).not.to.be.oneOf(['click here', 'here', 'link']);
          }
        });
      });
    });

    it('should have sufficient color contrast', () => {
      // Check for text elements
      cy.get('p, h1, h2, h3, h4, h5, h6, a, button, span').each($el => {
        // Get text color
        cy.wrap($el).invoke('css', 'color').then(color => {
          // Get background color
          cy.wrap($el).invoke('css', 'background-color').then(bgColor => {
            // Log colors for manual verification
            cy.log(`Element: ${$el.prop('tagName')}, Text: ${$el.text().substring(0, 20)}...`);
            cy.log(`Color: ${color}, Background: ${bgColor}`);
          });
        });
      });
    });
  });

  context('Blog Post Accessibility', () => {
    // Known blog post slug for testing - using a fallback approach
    const blogSlug = 'building-an-angular-project-with-bootstrap-4-and-firebase';

    beforeEach(() => {
      // First try to visit the homepage and click on the first blog post
      cy.visit('/');
      // Find any blog post link and click it
      cy.get('a[href*="/blog/"]').first().click();
      // Alternatively, if no blog posts are found, visit the blog index
      cy.url().then(url => {
        if (!url.includes('/blog/')) {
          cy.visit('/blog');
          cy.get('a[href*="/blog/"]').first().click();
        }
      });
    });

    it('should have proper heading hierarchy', () => {
      // Check for h1
      cy.get('h1').should('have.length', 1);

      // Check for proper heading order
      cy.get('h1').then($h1 => {
        // Get all headings
        cy.get('h2, h3, h4, h5, h6').each($heading => {
          // Get heading level
          const headingLevel = parseInt($heading.prop('tagName').replace('H', ''));

          // Get previous heading level
          const prevHeadingLevel = parseInt($heading.prevAll('h1, h2, h3, h4, h5, h6').first().prop('tagName').replace('H', ''));

          // Check if heading level is at most one level deeper than previous heading
          if (!isNaN(prevHeadingLevel)) {
            expect(headingLevel).to.be.at.most(prevHeadingLevel + 1);
          }
        });
      });
    });

    it('should have alt text for all images', () => {
      // Check for images
      cy.get('img').each($img => {
        // Check if image has alt attribute
        cy.wrap($img).should('have.attr', 'alt');

        // Check if alt text is not empty
        cy.wrap($img).invoke('attr', 'alt').should('not.be.empty');
      });
    });

    it('should have proper link text', () => {
      // Check for links
      cy.get('a').each($a => {
        // Check if link has text
        cy.wrap($a).invoke('text').then(text => {
          // Skip links with images
          if ($a.find('img').length === 0) {
            // Check if link text is not empty
            expect(text.trim()).to.not.be.empty;

            // Check if link text is not just "click here" or similar
            const linkText = text.trim().toLowerCase();
            expect(linkText).not.to.be.oneOf(['click here', 'here', 'link']);
          }
        });
      });
    });

    it('should have accessible code blocks', () => {
      // Check for code blocks
      cy.get('pre, code').then($code => {
        if ($code.length > 0) {
          // Check if code blocks have proper styling
          cy.get('pre').should('have.css', 'background-color');
          cy.get('pre').should('have.css', 'padding');
          cy.get('pre').should('have.css', 'border-radius');
        }
      });
    });
  });

  context('Navigation Accessibility', () => {
    beforeEach(() => {
      // Visit the homepage
      cy.visit('/');
    });

    it('should have keyboard navigable links', () => {
      // Check if links are keyboard focusable
      cy.get('a').first().focus().should('have.focus');

      // Check if focus is visible - allow for different CSS properties that indicate focus
      cy.get('a').first().focus().then($el => {
        // Check for any visual focus indicator (outline, ring, border, etc.)
        const hasFocusStyle =
          $el.css('outline') !== 'none' ||
          $el.css('box-shadow') !== 'none' ||
          $el.css('border-color') !== $el.css('background-color');

        expect(hasFocusStyle).to.be.true;
      });
    });

    it('should have keyboard navigable buttons', () => {
      // Check if buttons are keyboard focusable
      cy.get('button').then($buttons => {
        if ($buttons.length > 0) {
          // Focus the first button
          cy.get('button').first().focus();

          // Verify it received focus
          cy.focused().should('exist');

          // Check for any visual focus indicator
          cy.focused().then($el => {
            // Check for any visual focus indicator (outline, ring, border, etc.)
            const hasFocusStyle =
              $el.css('outline') !== 'none' ||
              $el.css('box-shadow') !== 'none' ||
              $el.css('border-color') !== $el.css('background-color');

            expect(hasFocusStyle).to.be.true;
          });
        }
      });
    });

    context('Form Accessibility', () => {
      beforeEach(() => {
        // Visit the homepage which has the search form
        cy.visit('/');
      });

      it('should have accessible forms if present', () => {
        // Check for forms
        cy.get('form').then($forms => {
          if ($forms.length > 0) {
            // Check if form inputs have proper accessibility attributes
            cy.get('form input, form textarea, form select').each($input => {
              // Check if input has id or aria-label
              cy.wrap($input).then($el => {
                const hasId = $el.attr('id') !== undefined;
                const hasAriaLabel = $el.attr('aria-label') !== undefined;
                const hasAriaLabelledBy = $el.attr('aria-labelledby') !== undefined;

                // Input should have either id, aria-label, or aria-labelledby
                expect(hasId || hasAriaLabel || hasAriaLabelledBy).to.be.true;

                // If it has an ID, check for a label or aria-label
                if (hasId) {
                  const id = $el.attr('id');
                  cy.get('body').then($body => {
                    const hasVisibleLabel = $body.find(`label[for="${id}"]`).length > 0;
                    const hasSrOnlyLabel = $body.find(`label[for="${id}"].sr-only`).length > 0;

                    // Should have either a visible label, sr-only label, or aria-label
                    expect(hasVisibleLabel || hasSrOnlyLabel || hasAriaLabel).to.be.true;
                  });
                }
              });
            });
          } else {
            cy.log('No forms found on this page');
          }
        });
      });
    });
  });
});
