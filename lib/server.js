const _ = require('lodash');
const config = require('config');
const io = require("socket.io");
const auth = require('socketio-auth');
const bcrypt = require("bcrypt");
const ObjectID = require('mongodb').ObjectID;
const Robot = require('./model/Robot');
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
    authenticate: function (socket, {key, secret}, callback) {
      Robot.findById(new ObjectID(key), function(err, robot) {
        if (err) return callback(err);
        if (!robot) return callback(new Error(`Robot ${key} not found`));
        return callback(null, bcrypt.compareSync(secret, robot.secret));
      });
    },
    postAuthenticate: function(socket, {key}) {
      Robot.findById(new ObjectID(key), function(err, robot) {
        if (err) throw err;
        socket.client.robot = robot;
      });
    }
  });

  return server;
};
