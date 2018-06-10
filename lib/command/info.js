const _ = require('lodash');
const pkg = require('../../package.json');

module.exports = function(socket) {
  socket.on('info', (cb) => {
    cb(_.pick(pkg, ['name', 'repository', 'version']));
  });
};
