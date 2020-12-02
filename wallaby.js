module.exports = function (wallaby) {
  return {
    files: [
      'src/**/*.ts',
      '!src/test/**/*.spec.ts',
      '!src/extension.ts'
    ],
    tests: [
      'src/test/**/*.spec.ts'
    ],
    env: {
      type: 'node',
      runner: 'node',
    },
    testFramework: 'mocha'
  };
};