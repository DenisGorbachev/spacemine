import death from 'death'
import init from './lib/init'
import serverSocket from './lib/server'

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
