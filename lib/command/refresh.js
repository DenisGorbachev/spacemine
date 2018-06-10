const Robot = require('../model/Robot');

module.exports = function(socket) {
  socket.on('refresh', async (cb) => {
    socket.client.robot = await Robot.findById(socket.client.robot._id).exec();
    cb();
  });
};
