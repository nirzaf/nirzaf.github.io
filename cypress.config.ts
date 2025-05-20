import { defineConfig } from 'cypress';

// Define custom test data with proper TypeScript interfaces
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

// Define the test data with proper typing
const TEST_DATA: TestData = {
  knownBlogSlugs: [
    'building-an-angular-project-with-bootstrap-4-and-firebase',
    'advanced-csharp-programming-delegates-events-generics-async-await-and-linq',
    'you-are-doing-validation-wrong-in-net-code',
    'mastering-sql-the-power-of-sum-with-case-when',
    'performance-optimization-techniques-in-python'
  ],
  knownTags: ['Angular', 'C#', 'Python', 'SQL', 'Validation'],
  viewportSizes: {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1280, height: 800 },
    largeDesktop: { width: 1920, height: 1080 }
  }
};

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 800,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    retries: {
      runMode: 2,
      openMode: 1
    },
    setupNodeEvents(on, config) {
      // Add test data to config object so it's available in tests
      config.env = config.env || {};
      config.env.TEST_DATA = TEST_DATA;

      // implement node event listeners here
      return config;
    },
  },
  // Component testing configuration
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    viewportWidth: 1280,
    viewportHeight: 800,
  },
});
