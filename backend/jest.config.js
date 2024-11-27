/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^../services/rideService$': '<rootDir>/src/__mocks__/rideServiceMock.ts',
  },
  globals: {
    NODE_ENV: 'test',
  },
};
