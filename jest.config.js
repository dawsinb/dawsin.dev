/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    "^components(.*)$": "<rootDir>/src/components$1",
    "^hooks(.*)$": "<rootDir>/src/hooks$1",
    "^stores(.*)$": "<rootDir>/src/stores$1",
    "^utils(.*)$": "<rootDir>/src/utils$1",
    "^loaders(.*)$": "<rootDir>/src/loaders$1"
  }
};