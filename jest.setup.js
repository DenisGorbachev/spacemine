const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const chaiSubset = require('chai-subset');
const config = require('config');
const Promise = require('bluebird');
const init = require('./lib/init');
const serverSocket = require('./lib/server');
const clientSocket = require("socket.io-client");
const Object = require('./lib/model/base/Object');
const Robot = require('./lib/model/Robot');

chai.use(chaiAsPromised);
chai.use(chaiSubset);
chai.should();

jest.setTimeout(3000);

beforeAll(async () => {
  await init();
  global.server = serverSocket();
});

afterAll((done) => {
  global.server.close(done);
});

beforeEach(async (done) => {
  await Object.removeAsync({});
  global.linda = await new Robot({
    name: 'Linda', secret: 'LindaSecret', tile: [0, 0], parts: [
      {type: 'battery', charge: 40, capacity: 50},
      {type: 'engine', range: 5, drain: 5},
      {type: 'scanner', range: 7, drain: 2},
    ]
  }).save();
  global.bart = await new Robot({
    name: 'Bart', secret: 'BartSecret', tile: [1, 0], parts: [
      {type: 'battery', charge: 60, capacity: 100},
      {type: 'engine', range: 10, drain: 7},
      {type: 'scanner', range: 10, drain: 3},
    ]
  }).save();
  global.client = clientSocket(`http://localhost:${config.get('port')}`);
  Promise.promisifyAll(global.client);
  global.client.emit('authentication', {key: linda._id.toString(), secret: 'LindaSecret'}, function() {
    console.log('auth');

    console.log(arguments);
  });
  global.client.on('authenticated', () => done());
});

afterEach(() => {
  global.client.disconnect();
});
