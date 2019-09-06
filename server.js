const death = require('death')
const init = require('./lib/init')
const serverSocket = require('./lib/server')

async function main() {
  await init()
  const server = serverSocket()
  death((signal, err) => {
    server.close(() => {
      process.exit()
    })
  })
}

main()
