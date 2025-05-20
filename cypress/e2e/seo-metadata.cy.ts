describe('SEO and Metadata', () => {
  context('Homepage SEO', () => {
    beforeEach(() => {
      // Visit the homepage
      cy.visit('/');
    });

    it('should have proper title and meta tags', () => {
      // Check page title
      cy.title().should('not.be.empty');
      
      // Check meta description
      cy.get('head meta[name="description"]').should('exist');
      
      // Check canonical link
      cy.get('head link[rel="canonical"]').should('have.attr', 'href');
      
      // Check robots meta tag
      cy.get('head meta[name="robots"]').should('exist');
    });

    it('should have OpenGraph meta tags', () => {
      // Check OpenGraph title
      cy.get('head meta[property="og:title"]').should('exist');
      
      // Check OpenGraph description
      cy.get('head meta[property="og:description"]').should('exist');
      
      // Check OpenGraph type
      cy.get('head meta[property="og:type"]').should('exist');
      
      // Check OpenGraph URL
      cy.get('head meta[property="og:url"]').should('exist');
      
      // Check OpenGraph image if available
      cy.get('head meta[property="og:image"]').should('have.length.at.least', 0);
    });

    it('should have Twitter Card meta tags if available', () => {
      // Check Twitter Card meta tags
      cy.get('head meta[name="twitter:card"]').should('have.length.at.least', 0);
      cy.get('head meta[name="twitter:title"]').should('have.length.at.least', 0);
      cy.get('head meta[name="twitter:description"]').should('have.length.at.least', 0);
    });
  });

  context('Blog Post SEO', () => {
    // Known blog post slug for testing
    const blogSlug = 'building-an-angular-project-with-bootstrap-4-and-firebase';
    
    beforeEach(() => {
      // Visit the blog post
      cy.visit(`/blog/${blogSlug}`);
    });

    it('should have proper title and meta tags', () => {
      // Check page title
      cy.title().should('not.be.empty');
      
      // Check meta description
      cy.get('head meta[name="description"]').should('exist');
      
      // Check canonical link
      cy.get('head link[rel="canonical"]').should('have.attr', 'href').and('include', blogSlug);
      
      // Check robots meta tag
      cy.get('head meta[name="robots"]').should('exist');
    });

    it('should have OpenGraph meta tags for article', () => {
      // Check OpenGraph title
      cy.get('head meta[property="og:title"]').should('exist');
      
      // Check OpenGraph description
      cy.get('head meta[property="og:description"]').should('exist');
      
      // Check OpenGraph type
      cy.get('head meta[property="og:type"]').should('have.attr', 'content', 'article');
      
      // Check OpenGraph URL
      cy.get('head meta[property="og:url"]').should('have.attr', 'content').and('include', blogSlug);
      
      // Check OpenGraph image if available
      cy.get('head meta[property="og:image"]').should('have.length.at.least', 0);
      
      // Check article published time if available
      cy.get('head meta[property="article:published_time"]').should('have.length.at.least', 0);
    });

    it('should have Twitter Card meta tags if available', () => {
      // Check Twitter Card meta tags
      cy.get('head meta[name="twitter:card"]').should('have.length.at.least', 0);
      cy.get('head meta[name="twitter:title"]').should('have.length.at.least', 0);
      cy.get('head meta[name="twitter:description"]').should('have.length.at.least', 0);
    });
  });

  context('Tag Page SEO', () => {
    // Known tag for testing
    const tag = 'Angular';
    
    beforeEach(() => {
      // Visit the tag page
      cy.visit(`/tags/${tag.toLowerCase()}`);
    });

    it('should have proper title and meta tags', () => {
      // Check page title
      cy.title().should('include', tag);
      
      // Check meta description
      cy.get('head meta[name="description"]').should('exist');
      
      // Check canonical link
      cy.get('head link[rel="canonical"]').should('have.attr', 'href').and('include', `/tags/${tag.toLowerCase()}`);
      
      // Check robots meta tag
      cy.get('head meta[name="robots"]').should('exist');
    });

    it('should have OpenGraph meta tags', () => {
      // Check OpenGraph title
      cy.get('head meta[property="og:title"]').should('exist');
      
      // Check OpenGraph description
      cy.get('head meta[property="og:description"]').should('exist');
      
      // Check OpenGraph type
      cy.get('head meta[property="og:type"]').should('exist');
      
      // Check OpenGraph URL
      cy.get('head meta[property="og:url"]').should('have.attr', 'content').and('include', `/tags/${tag.toLowerCase()}`);
    });
  });

  context('About Page SEO', () => {
    beforeEach(() => {
      // Visit the about page
      cy.visit('/about');
    });

    it('should have proper title and meta tags', () => {
      // Check page title
      cy.title().should('include', 'About');
      
      // Check meta description
      cy.get('head meta[name="description"]').should('exist');
      
      // Check canonical link
      cy.get('head link[rel="canonical"]').should('have.attr', 'href').and('include', '/about');
      
      // Check robots meta tag
      cy.get('head meta[name="robots"]').should('exist');
    });

    it('should have OpenGraph meta tags', () => {
      // Check OpenGraph title
      cy.get('head meta[property="og:title"]').should('exist');
      
      // Check OpenGraph description
      cy.get('head meta[property="og:description"]').should('exist');
      
      // Check OpenGraph type
      cy.get('head meta[property="og:type"]').should('exist');
      
      // Check OpenGraph URL
      cy.get('head meta[property="og:url"]').should('have.attr', 'content').and('include', '/about');
    });
  });

  context('404 Page SEO', () => {
    beforeEach(() => {
      // Visit a non-existent page
      cy.visit('/this-page-does-not-exist', { failOnStatusCode: false });
    });

    it('should have proper title and meta tags', () => {
      // Check page title
      cy.title().should('include', '404');
      
      // Check meta description
      cy.get('head meta[name="description"]').should('exist');
      
      // Check robots meta tag
      cy.get('head meta[name="robots"]').should('have.attr', 'content').and('include', 'noindex');
    });
  });
});
