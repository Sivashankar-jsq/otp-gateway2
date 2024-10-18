/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: [
    "lcov",
    "text",
    "cobertura",
    "json-summary",
    "text-summary",
  ],
  coverageThreshold: {
    global: {
      statements: 89.18,
      branches: 75,
      functions: 81.81,
      lines: 89.04,
    },
  },
  moduleNameMapper: {},
  modulePathIgnorePatterns: ["<rootDir>/build/"],
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
};
