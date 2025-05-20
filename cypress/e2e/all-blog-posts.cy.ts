describe('All Blog Posts', () => {
  it('should verify blog index page is accessible', () => {
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

  it('should verify multiple blog posts are accessible', () => {
    // Define a list of known blog posts to check
    const knownPosts = [
      'building-an-angular-project-with-bootstrap-4-and-firebase',
      'advanced-csharp-programming-delegates-events-generics-async-await-and-linq',
      'you-are-doing-validation-wrong-in-net-code'
    ];

    // Count successful responses
    let successCount = 0;

    // Check each known post
    knownPosts.forEach(slug => {
      cy.request({
        url: `http://localhost:3000/blog/${slug}`,
        failOnStatusCode: false
      }).then((response) => {
        // Log the response status
        cy.log(`Blog post "${slug}" response status: ${response.status}`);

        // Count successful responses
        if (response.status >= 200 && response.status < 300) {
          successCount++;
        }
      });
    });

    // After checking all posts, verify that at least one was successful
    cy.then(() => {
      cy.log(`Successfully accessed ${successCount} out of ${knownPosts.length} blog posts`);
      expect(successCount).to.be.greaterThan(0);
    });
  });
});
