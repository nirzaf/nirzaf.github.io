describe('Image Loading Tests', () => {
  // Array of blog post slugs to test images
  const blogSlugs = [
    'building-an-angular-project-with-bootstrap-4-and-firebase',
    'advanced-csharp-programming-delegates-events-generics-async-await-and-linq',
    'you-are-doing-validation-wrong-in-net-code',
    'mastering-sql-the-power-of-sum-with-case-when',
    'performance-optimization-techniques-in-python'
  ];

  // Test images in each blog post
  blogSlugs.forEach(slug => {
    it(`should check for image references in blog post: ${slug}`, () => {
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

        // Check if the response body contains image references
        const hasImageKit = response.body.includes('imagekit.io');
        const hasImgTag = response.body.includes('<img');

        // Log image findings
        cy.log(`Blog post contains ImageKit references: ${hasImageKit}`);
        cy.log(`Blog post contains img tags: ${hasImgTag}`);

        // At least one type of image reference should exist
        expect(hasImageKit || hasImgTag).to.be.true;
      });
    });
  });
});
