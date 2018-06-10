const _ = require('lodash');
const should = require('should');
const config = require('config');
const serverSocket = require("socket.io");
const clientSocket = require("socket.io-client");
let server, client;

beforeAll(() => {
  server = serverSocket(config.get('port'));
  server.on('connection', (socket) => {
    socket.on('info', (cb) => {
      cb(_.pick(require('../package.json'), ['name', 'repository', 'version']));
    });
  });
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

test('info', (done) => {
  client.emit('info', (info) => {
    info.name.should.equal('spacemine');
    done();
  });
});
