const should = require('should');
const config = require('config');
const clientSocket = require("socket.io-client");
const Robot = require('../lib/model/Robot');
let server, client;

beforeAll(() => {
  server = require('../lib/server');
  const linda = new Robot({name: 'Linda', key: 'valid-key', secret: 'valid-secret'});
  return linda.save();
});

afterAll((done) => {
  server.close(done);
});

beforeEach(() => {
  client = clientSocket(`http://localhost:${config.get('port')}`);
});

afterEach(() => {
  client.disconnect();
});

test('invalid-key', (done) => {
  client.emit('authentication', {key: "invalid-key", secret: "invalid-secret"});
  client.on('unauthorized', function(err) {
    if (err) done();
  });
});

test('invalid-secret', (done) => {
  client.emit('authentication', {key: "valid-key", secret: "invalid-secret"});
  client.on('unauthorized', function(err) {
    if (err) done();
  });
});

test('valid-secret', (done) => {
  client.emit('authentication', {key: "valid-key", secret: "valid-secret"});
  client.on('authenticated', function(data) {
    data.should.equal(true);
    done();
  });
});
