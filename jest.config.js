module.exports = {
  automock: false,
  clearMocks: true,
  coverageDirectory: 'coverage',
  verbose: true,
  setupFiles: [
    './config/jest.js',
  ],
  globals: {
    DeviceIcon: {
      system: 'system',
    },
  },
  testEnvironment: 'node',
};
