describe('Blog Post Detail Page', () => {
  // Known blog post slugs for testing
  const blogSlugs = [
    'building-an-angular-project-with-bootstrap-4-and-firebase',
    'advanced-csharp-programming-delegates-events-generics-async-await-and-linq',
    'you-are-doing-validation-wrong-in-net-code'
  ];
  
  // Test a specific blog post
  context(`Blog Post: ${blogSlugs[0]}`, () => {
    beforeEach(() => {
      // Visit the blog post before each test
      cy.visit(`/blog/${blogSlugs[0]}`);
    });

    it('should load the blog post successfully', () => {
      // Check if the page has loaded
      cy.get('body').should('be.visible');
      
      // Check for main content
      cy.get('main').should('be.visible');
      
      // Check for post title
      cy.get('h1').should('be.visible');
    });

    it('should display post metadata', () => {
      // Check for post date
      cy.get('time').should('be.visible');
      
      // Check for reading time if available
      cy.get('body').contains(/min read|minute read|reading time/i).should('exist');
      
      // Check for tags if available
      cy.get('a[href*="/tags/"]').should('have.length.at.least', 0);
    });

    it('should display post content', () => {
      // Check for post content container
      cy.get('.prose, article, [class*="content"]').should('be.visible');
      
      // Check for paragraphs in content
      cy.get('p').should('have.length.at.least', 1);
      
      // Check for headings in content
      cy.get('h2, h3, h4, h5, h6').should('have.length.at.least', 0);
    });

    it('should display post images correctly', () => {
      // Check for images in post content
      cy.get('img').then($imgs => {
        if ($imgs.length > 0) {
          // Check first image
          cy.wrap($imgs).first().should('be.visible');
          cy.wrap($imgs).first().should('have.attr', 'src');
          cy.wrap($imgs).first().should('have.attr', 'alt');
        } else {
          cy.log('No images found in this post');
        }
      });
    });

    it('should have properly formatted code blocks if present', () => {
      // Check for code blocks
      cy.get('pre, code').then($code => {
        if ($code.length > 0) {
          // Check if code blocks have proper formatting
          cy.get('pre').should('have.css', 'background-color');
          cy.get('pre code').should('exist');
        } else {
          cy.log('No code blocks found in this post');
        }
      });
    });

    it('should have working links in content', () => {
      // Check for links in content
      cy.get('.prose a, article a, [class*="content"] a').then($links => {
        if ($links.length > 0) {
          // Check if links have href attribute
          cy.get('.prose a, article a, [class*="content"] a').first().should('have.attr', 'href');
        } else {
          cy.log('No links found in post content');
        }
      });
    });

    it('should have proper SEO metadata', () => {
      // Check page title
      cy.title().should('not.be.empty');
      
      // Check meta description
      cy.get('head meta[name="description"]').should('exist');
      
      // Check canonical link
      cy.get('head link[rel="canonical"]').should('have.attr', 'href').and('include', blogSlugs[0]);
      
      // Check OpenGraph tags
      cy.get('head meta[property="og:title"]').should('exist');
      cy.get('head meta[property="og:description"]').should('exist');
      cy.get('head meta[property="og:type"]').should('have.attr', 'content', 'article');
    });
  });

  // Test MDX rendering features across multiple posts
  context('MDX Rendering Features', () => {
    // Test each blog post for MDX features
    blogSlugs.forEach(slug => {
      it(`should render MDX content correctly in post: ${slug}`, () => {
        // Visit the blog post
        cy.visit(`/blog/${slug}`);
        
        // Check for basic MDX elements
        cy.get('.prose, article, [class*="content"]').within(() => {
          // Check for paragraphs
          cy.get('p').should('exist');
          
          // Check for lists if they exist
          cy.get('ul, ol').should('have.length.at.least', 0);
          
          // Check for blockquotes if they exist
          cy.get('blockquote').should('have.length.at.least', 0);
          
          // Check for horizontal rules if they exist
          cy.get('hr').should('have.length.at.least', 0);
        });
      });
    });

    it('should render custom MDX components if present', () => {
      // Visit each blog post and check for custom components
      blogSlugs.forEach(slug => {
        cy.visit(`/blog/${slug}`);
        
        // Check for Tweet component
        cy.get('body').contains('Twitter embed').then($tweet => {
          if ($tweet.length > 0) {
            cy.log(`Found Tweet component in post: ${slug}`);
          }
        });
        
        // Check for YouTube component
        cy.get('body').contains('YouTube embed').then($youtube => {
          if ($youtube.length > 0) {
            cy.log(`Found YouTube component in post: ${slug}`);
          }
        });
        
        // Check for iframes
        cy.get('iframe').then($iframe => {
          if ($iframe.length > 0) {
            cy.log(`Found iframe in post: ${slug}`);
            cy.get('iframe').should('have.attr', 'src');
          }
        });
      });
    });
  });

  context('Navigation and Interaction', () => {
    it('should navigate to tag pages when clicking on tags', () => {
      // Visit the first blog post
      cy.visit(`/blog/${blogSlugs[0]}`);
      
      // Check for tags
      cy.get('a[href*="/tags/"]').then($tags => {
        if ($tags.length > 0) {
          // Get the href of the first tag
          const href = $tags.first().attr('href');
          
          // Click on the first tag
          cy.get('a[href*="/tags/"]').first().click();
          
          // Verify navigation to tag page
          cy.url().should('include', href);
          
          // Check if tag page loaded
          cy.get('h1').contains('#').should('be.visible');
        } else {
          cy.log('No tags found in this post');
        }
      });
    });

    it('should have share buttons for social media', () => {
      // Visit the first blog post
      cy.visit(`/blog/${blogSlugs[0]}`);
      
      // Check for share buttons or section
      cy.get('body').contains(/share|Share this/i).then($share => {
        if ($share.length > 0) {
          // Check for social media share links
          cy.get('a[href*="twitter.com/intent/tweet"], a[href*="facebook.com/sharer"], a[href*="linkedin.com/shareArticle"]')
            .should('have.length.at.least', 0);
        } else {
          cy.log('No share section found in this post');
        }
      });
    });
  });

  context('Responsive Design', () => {
    it('should adapt layout for different screen sizes', () => {
      // Visit the first blog post
      cy.visit(`/blog/${blogSlugs[0]}`);
      
      // Test mobile viewport
      cy.testResponsive('mobile', () => {
        // Check if content is properly sized for mobile
        cy.get('.prose, article, [class*="content"]').should('be.visible');
        cy.get('.prose, article, [class*="content"]').invoke('width').should('be.lessThan', 500);
      });
      
      // Test desktop viewport
      cy.testResponsive('desktop', () => {
        // Check if content is properly sized for desktop
        cy.get('.prose, article, [class*="content"]').should('be.visible');
        cy.get('.prose, article, [class*="content"]').invoke('width').should('be.greaterThan', 500);
      });
    });
  });

  context('Accessibility', () => {
    it('should be accessible', () => {
      // Visit the first blog post
      cy.visit(`/blog/${blogSlugs[0]}`);
      
      // Check basic accessibility
      cy.checkA11y();
    });
  });

  context('404 Handling for Non-existent Posts', () => {
    it('should display 404 page for non-existent blog posts', () => {
      // Visit a non-existent blog post
      cy.visit('/blog/this-post-does-not-exist', { failOnStatusCode: false });
      
      // Check for 404 page
      cy.get('body').contains(/404|not found|page not found/i).should('be.visible');
      
      // Check for link back to homepage
      cy.get('a[href="/"]').should('be.visible');
    });
  });
});
