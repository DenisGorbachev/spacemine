const _ = require('lodash');
const Joi = require('joi');
const schema = Joi.object({});
const Robot = require('../model/Robot');

module.exports = function(socket) {
  socket.on('scan', async function(params, cb) {
    const {error} = schema.validate(params, {presence: 'required'});
    if (error) return cb({error: 'wrong-arguments', details: error.details});
    const {robot} = socket.client;
    const battery = robot.part('battery');
    if (!battery) return cb({error: 'no-battery'});
    const scanner = robot.part('scanner');
    if (!scanner) return cb({error: 'no-scanner'});
    if (scanner.drain > battery.charge) return cb({error: 'insufficient-charge', drain: scanner.drain, charge: battery.charge});
    const objects = await Object.find({tile: {$near: robot.tile, $maxDistance: scanner.range}, _id: {$ne: robot._id}}, {secret: 0});
    battery.charge = battery.charge - scanner.drain;
    robot.markModified('parts');
    await robot.save();
    cb(null, {robot: robot.serialize(), objects})
  })
};
