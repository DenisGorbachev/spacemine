const should = require('should');
const config = require('config');
const clientSocket = require("socket.io-client");
const Robot = require('./lib/model/Robot');

jest.setTimeout(3000);

beforeAll(async () => {
  global.server = require('./lib/server');
  const linda = new Robot({name: 'Linda', key: 'LindaKey', secret: 'LindaSecret', x: 0, y: 0, parts: [{type: 'engine', range: 5, drain: 5}]});
  return linda.save();
});

afterAll((done) => {
  global.server.close(done);
});

beforeEach((done) => {
  global.client = clientSocket(`http://localhost:${config.get('port')}`);
  global.client.emit('authentication', {key: 'LindaKey', secret: 'LindaSecret'});
  global.client.on('authenticated', () => done());
});

afterEach(() => {
  global.client.disconnect();
});
