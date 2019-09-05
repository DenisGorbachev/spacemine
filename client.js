#!/usr/bin/env node

import io from 'socket.io-client'

(async function () {
  const client = io(config.get('server'))
  Promise.promisifyAll(client)
  const robots = await client.emitAsync('ls')
  await client.emitAsync('mv', {
    robotId: robots[0]._id,
    x: 10,
    y: 10,
  })
})()

