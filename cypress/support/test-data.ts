// Helper functions to access test data from Cypress environment

/**
 * Get known blog slugs for testing
 */
export const getKnownBlogSlugs = (): string[] => {
  return Cypress.env('TEST_DATA')?.knownBlogSlugs || [];
};

/**
 * Get known tags for testing
 */
export const getKnownTags = (): string[] => {
  return Cypress.env('TEST_DATA')?.knownTags || [];
};

/**
 * Get viewport size by name
 * @param name - The name of the viewport (mobile, tablet, desktop, largeDesktop)
 */
export const getViewportSize = (name: 'mobile' | 'tablet' | 'desktop' | 'largeDesktop') => {
  return Cypress.env('TEST_DATA')?.viewportSizes?.[name] || { width: 1280, height: 800 };
};

/**
 * Set viewport to a predefined size
 * @param name - The name of the viewport (mobile, tablet, desktop, largeDesktop)
 */
export const setViewport = (name: 'mobile' | 'tablet' | 'desktop' | 'largeDesktop') => {
  const size = getViewportSize(name);
  cy.viewport(size.width, size.height);
};
