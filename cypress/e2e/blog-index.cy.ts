describe('Blog Index Page', () => {
  it('should load the blog index page successfully', () => {
    // Use cy.request instead of cy.visit to check if the blog index page is accessible
    cy.request({
      url: 'http://localhost:3000/blog',
      failOnStatusCode: false
    }).then((response) => {
      // Log the response status
      cy.log(`Blog index page response status: ${response.status}`);

      // Check if the response is successful (2xx)
      expect(response.status).to.be.within(200, 299);

      // Check if the response contains HTML
      expect(response.headers['content-type']).to.include('text/html');
    });
  });

  it('should have blog posts available', () => {
    // Check a few known blog posts to make sure they're accessible
    const samplePosts = [
      'building-an-angular-project-with-bootstrap-4-and-firebase',
      'you-are-doing-validation-wrong-in-net-code'
    ];

    // Check each sample post
    samplePosts.forEach(slug => {
      cy.request({
        url: `http://localhost:3000/blog/${slug}`,
        failOnStatusCode: false
      }).then((response) => {
        // Log the response status
        cy.log(`Blog post "${slug}" response status: ${response.status}`);

        // Check if the response is successful (2xx)
        expect(response.status).to.be.within(200, 299);
      });
    });
  });
});
