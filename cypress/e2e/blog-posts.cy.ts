describe('Blog Posts', () => {
  // Array of blog post slugs to test
  const blogSlugs = [
    'building-an-angular-project-with-bootstrap-4-and-firebase',
    'advanced-csharp-programming-delegates-events-generics-async-await-and-linq',
    'you-are-doing-validation-wrong-in-net-code',
    'mastering-sql-the-power-of-sum-with-case-when',
    'performance-optimization-techniques-in-python'
  ];

  // Test each blog post
  blogSlugs.forEach(slug => {
    it(`should load blog post: ${slug}`, () => {
      // Use cy.request instead of cy.visit to check if the blog post is accessible
      cy.request({
        url: `http://localhost:3000/blog/${slug}`,
        failOnStatusCode: false
      }).then((response) => {
        // Log the response status
        cy.log(`Blog post "${slug}" response status: ${response.status}`);

        // Check if the response is successful (2xx)
        expect(response.status).to.be.within(200, 299);

        // Check if the response contains HTML
        expect(response.headers['content-type']).to.include('text/html');

        // Check if the response body contains the slug (to verify it's the right page)
        expect(response.body).to.include(slug);
      });
    });
  });
});
