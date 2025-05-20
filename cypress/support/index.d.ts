/// <reference types="cypress" />

// Define the structure of our test data
interface ViewportSize {
  width: number;
  height: number;
}

interface TestData {
  knownBlogSlugs: string[];
  knownTags: string[];
  viewportSizes: {
    mobile: ViewportSize;
    tablet: ViewportSize;
    desktop: ViewportSize;
    largeDesktop: ViewportSize;
  };
}

// Augment the Cypress namespace to include our custom properties
declare namespace Cypress {
  interface Chainable {
    // Add custom commands here if needed
  }

  // Add TEST_DATA to the env object
  interface EnvKeys {
    TEST_DATA: TestData;
  }

  interface ResolvedConfigOptions {
    env: EnvKeys & Cypress.ObjectLike;
  }
}
