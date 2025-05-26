/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  silent: false,
  testEnvironment: 'node',
  transform: {
    '^.+\.tsx?$': ['ts-jest', {}],
  },
};
