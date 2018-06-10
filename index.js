const server = require('./lib/server');

require('death')(function(signal, err) {
  server.close(function() {
    console.info('shutdown')
  });
});
