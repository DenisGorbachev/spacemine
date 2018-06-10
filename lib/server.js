const _ = require('lodash');
const config = require('config');
const io = require("socket.io");
const auth = require('socketio-auth');
const bcrypt = require("bcrypt");
const Robot = require('./model/Robot');
const info = require('./command/info');
const refresh = require('./command/refresh');
const move = require('./command/move');

const server = io(config.get('port'));
server.on('connection', (socket) => {
  info(socket);
  refresh(socket);
  move(socket);
});

auth(server, {
  authenticate: function (socket, {key, secret}, callback) {
    Robot.findOne({key}, function(err, robot) {
      if (err) return callback(err);
      if (!robot) return callback(new Error(`Robot ${key} not found`));
      return callback(null, bcrypt.compareSync(secret, robot.secret));
    });
  },
  postAuthenticate: function(socket, {key}) {
    Robot.findOne({key}, function(err, robot) {
      if (err) throw err;
      socket.client.robot = robot;
    });
  }
});

module.exports = server;
