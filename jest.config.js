/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "^Components(.*)$": "<rootDir>/src/components$1",
    "^Utils(.*)$": "<rootDir>/src/utils$1",
  } 
};