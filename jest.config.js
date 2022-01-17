/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    "^Components(.*)$": "<rootDir>/src/components$1",
    "^Hooks(.*)$": "<rootDir>/src/hooks$1",
    "^Stores(.*)$": "<rootDir>/src/stores$1",
    "^Utils(.*)$": "<rootDir>/src/utils$1"
  }
};