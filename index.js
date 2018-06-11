const init = require('./lib/init');
const serverSocket = require('./lib/server');
const death = require('death');

(async function() {
  await init();
  const server = serverSocket();
  death(function(signal, err) {
    server.close(function() {
      console.info('shutdown')
    });
  });
})();

