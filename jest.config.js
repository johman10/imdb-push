module.exports = {
  automock: false,
  clearMocks: true,
  coverageDirectory: 'coverage',
  verbose: true,
  setupFiles: [
    './config/jest.js',
  ],
  testEnvironment: 'node',
};
