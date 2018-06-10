const {defaults} = require('jest-config');

process.env['NODE_ENV'] = 'test';

module.exports = {
  setupTestFrameworkScriptFile: './jest.setup.js'
};
