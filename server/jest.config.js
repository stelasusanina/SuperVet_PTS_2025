export default {
  testEnvironment: 'node', // Use Node.js as the test environment
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest', // Transform JavaScript files using Babel
  },
  testMatch: ['**/?(*.)+(test).js'], // Match test files
  transformIgnorePatterns: ['/node_modules/'], // Ignore transforming node_modules
};
