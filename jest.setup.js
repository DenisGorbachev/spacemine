const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiSubset = require('chai-subset');
const config = require('config');
const Promise = require('bluebird');
const init = require('./lib/init');
const serverSocket = require('./lib/server');
const clientSocket = require('socket.io-client');
const User = require('./lib/model/User');
const Robot = require('./lib/model/Robot');

chai.use(chaiAsPromised);
chai.use(chaiSubset);
chai.should();

jest.setTimeout(3000);

beforeAll(async () => {
  global.mongoose = await init();
  global.server = serverSocket();
});

afterAll(async () => {
  await global.mongoose.connection.close();
  await global.server.closeAsync();
});

beforeEach(async (done) => {
  await User.deleteManyAsync({});
  await Robot.deleteManyAsync({});
  global.alice = await new User({
    email: 'alice@example.com',
    username: 'alice',
    password: '123123',
  }).save();
  global.bob = await new User({
    email: 'bob@example.com',
    username: 'bob',
    password: '123123',
  }).save();
  global.linda = await new Robot({
    name: 'Linda',
    config: 'MSFD',
    coords: [0, 0],
    userId: global.alice
  }).save();
  global.bart = await new Robot({
    name: 'Bart',
    config: 'MSFDSFDDFM',
    coords: [1, 0],
    userId: global.bob
  }).save();
  global.client = clientSocket(`http://localhost:${config.get('port')}`);
  Promise.promisifyAll(global.client);
  global.client.emit('authentication', { username: 'alice', password: '123123' });
  global.client.on('authenticated', () => done());
});

afterEach(() => {
  global.client.disconnect();
});
