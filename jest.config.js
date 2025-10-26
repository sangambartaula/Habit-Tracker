module.exports = {
    testEnvironment: 'jsdom',
    collectCoverageFrom: [
      '**/*.js',
      '!node_modules/**',
      '!tests/**',
      '!jest.config.js'
    ],
    coverageThreshold: {
      global: {
        branches: 85,
        functions: 85,
        lines: 85,
        statements: 85
      }
    },
    testMatch: ['**/tests/**/*.test.js'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    }
  };