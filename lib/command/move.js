const _ = require('lodash');
const Joi = require('joi');
const schema = Joi.object({
  x: Joi.number().integer(),
  y: Joi.number().integer(),
});
const Object = require('../model/base/Object');

module.exports = function(socket) {
  socket.on('move', async function(params, cb) {
    const {error} = schema.validate(params, {presence: 'required'});
    if (error) return cb({error: 'wrong-arguments', details: error.details});
    const {x, y} = params;
    const {robot} = socket.client;
    if (robot.tile[0] === x && robot.tile[1] === y) return cb({error: 'already-there'});
    const object = await Object.findOne({tile: [x, y]});
    if (object) return cb({error: 'tile-occupied', object: object});
    const battery = robot.part('battery');
    if (!battery) return cb({error: 'no-battery'});
    const engine = robot.part('engine');
    if (!engine) return cb({error: 'no-engine'});
    const range = Math.sqrt(Math.pow(x - robot.tile[0], 2) + Math.pow(y - robot.tile[1], 2));
    if (range > engine.range) return cb({error: 'insufficient-engine-range', range: engine.range});
    if (engine.drain > battery.charge) return cb({error: 'insufficient-charge', drain: engine.drain, charge: battery.charge});
    robot.tile = [x, y];
    battery.charge = battery.charge - engine.drain;
    robot.markModified('parts');
    await robot.save();
    cb(null, {robot: robot.serialize()})
  })
};
