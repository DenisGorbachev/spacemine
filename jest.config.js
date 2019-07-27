const { defaults } = require('jest-config');

process.env['NODE_ENV'] = 'test';

module.exports = {
  testEnvironment: 'node',

  setupFilesAfterEnv: ['./jest.setup.js']
};
