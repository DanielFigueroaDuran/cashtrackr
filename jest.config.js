/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  detectOpenHandles: true,
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  }
};