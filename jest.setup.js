const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const config = require('config');
const Promise = require('bluebird');
const clientSocket = require("socket.io-client");
const Robot = require('./lib/model/Robot');

chai.use(chaiAsPromised);
chai.should();

jest.setTimeout(3000);

beforeAll(async () => {
  global.server = require('./lib/server');
});

afterAll((done) => {
  global.server.close(done);
});

beforeEach(async (done) => {
  await Robot.removeAsync({});
  const linda = new Robot({name: 'Linda', key: 'LindaKey', secret: 'LindaSecret', x: 0, y: 0, parts: [
    {type: 'engine', range: 5, drain: 5},
    {type: 'battery', charge: 40, capacity: 50}
  ]});
  await linda.save();
  global.client = clientSocket(`http://localhost:${config.get('port')}`);
  Promise.promisifyAll(global.client);
  global.client.emit('authentication', {key: 'LindaKey', secret: 'LindaSecret'});
  global.client.on('authenticated', () => done());
});

afterEach(() => {
  global.client.disconnect();
});
