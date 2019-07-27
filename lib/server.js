const _ = require('lodash');
const Promise = require('bluebird');
const config = require('config');
const io = require("socket.io");
const auth = require('socketio-auth');
const bcrypt = require("bcrypt");
const User = require('./model/User');
const info = require('./command/info');
const refresh = require('./command/refresh');
const scan = require('./command/scan');
const move = require('./command/move');

module.exports = function() {
  const server = io(config.get('port'));

  server.on('connection', (socket) => {
    info(socket);
    refresh(socket);
    scan(socket);
    move(socket);
  });

  auth(server, {
    authenticate: function (socket, {username, password}, callback) {
      User.findOne({username}, function(err, user) {
        if (err) return callback(err);
        if (!user) return callback(new Error(`User "${username}" not found`));
        return callback(null, bcrypt.compareSync(password, user.password));
      });
    },
    postAuthenticate: function(socket, {username}) {
      User.findOne({username}, function(err, user) {
        if (err) throw err;
        socket.client.user = user;
      });
    }
  });

  Promise.promisifyAll(server);

  return server;
};
