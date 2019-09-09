import init from './lib/init'
import serverSocket from './lib/server'

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const chaiSubset = require('chai-subset')
const config = require('config')
const Promise = require('bluebird')
// eslint-disable-next-line import/no-extraneous-dependencies
const clientSocket = require('socket.io-client')
const User = require('./lib/model/User')
const Robot = require('./lib/model/Robot')

chai.use(chaiAsPromised)
chai.use(chaiSubset)
chai.should()

jest.setTimeout(3000)

// Workaround for Jest not displaying errors from before hooks
const tryCatch = function (f) {
  return async function (...args) {
    try {
      await f.apply(this, args)
    } catch (e) {
      console.error(e)
    }
  }
}

function waitForEvent(observable, event, timeout = 1000) {
  return new Promise(((resolve, reject) => {
    let timer

    function listener(data) {
      clearTimeout(timer)
      observable.removeListener(event, listener)
      resolve(data)
    }

    observable.on(event, listener)
    timer = setTimeout(() => {
      observable.removeListener(event, listener)
      reject(new Error('timeout'))
    }, timeout)
  }))
}

beforeAll(tryCatch(async () => {
  global.mongoose = await init()
  global.server = serverSocket()
}))

afterAll(tryCatch(async () => {
  await global.mongoose.connection.close()
  await global.server.closeAsync()
}))

beforeEach(tryCatch(async () => {
  await User.deleteManyAsync({})
  await Robot.deleteManyAsync({})
  global.alice = await new User({
    email: 'alice@example.com',
    username: 'alice',
    password: '123123',
  }).save()
  global.bob = await new User({
    email: 'bob@example.com',
    username: 'bob',
    password: '123123',
  }).save()
  global.linda = await new Robot({
    name: 'Linda',
    config: 'MSFD',
    coords: [0, 0],
    userId: global.alice,
  }).save()
  global.bart = await new Robot({
    name: 'Bart',
    config: 'MSFDSFDDFM',
    coords: [1, 0],
    userId: global.bob,
  }).save()
  global.client = clientSocket(`http://localhost:${config.get('port')}`)
  Promise.promisifyAll(global.client)
  global.client.emit('authentication', { username: 'alice', password: '123123' })
  await waitForEvent(global.client, 'authenticated')
}))

afterEach(tryCatch(async () => {
  global.client.disconnect()
}))
