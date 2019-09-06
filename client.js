// eslint-disable-next-line import/no-extraneous-dependencies
import io from 'socket.io-client'
import config from 'config'

export default async function run(client) {
  const robots = await client.emitAsync('ls')
  await client.emitAsync('mv', {
    robotId: robots[0]._id,
    x: 10,
    y: 10,
  })
}

async function main() {
  const client = io(config.get('server'))
  Promise.promisifyAll(client)
  return run(client)
}

main()
