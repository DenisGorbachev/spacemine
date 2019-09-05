const _ = require('lodash');
const Joi = require('joi');
const schema = Joi.object({
  robotId: Joi.string(),
  x: Joi.number().integer(),
  y: Joi.number().integer(),
});
const Robot = require('../model/Robot');

module.exports = function(socket) {
  socket.on('move', async function(params, cb) {
    const {error} = schema.validate(params, {presence: 'required'});
    if (error) return cb({error: 'wrong-arguments', details: error.details});
    const {robotId, x, y} = params;
    const robot = await Robot.findOne({_id: robotId});
    if (robot.coords[0] === x && robot.coords[1] === y) return cb({error: 'already-there'});
    const object = await Robot.findOne({coords: [x, y]});
    if (object) return cb({error: 'coords-occupied', object: object});
    // TODO: check if robot can move
    // const battery = robot.part('battery');
    // if (!battery) return cb({error: 'no-battery'});
    // const engine = robot.part('engine');
    // if (!engine) return cb({error: 'no-engine'});
    // TODO: check if robot can move within range
    // const range = Math.sqrt(Math.pow(x - robot.coords[0], 2) + Math.pow(y - robot.coords[1], 2));
    // if (range > engine.range) return cb({error: 'insufficient-engine-range', range: engine.range});
    // if (engine.drain > battery.charge) return cb({error: 'insufficient-charge', drain: engine.drain, charge: battery.charge});
    robot.coords = [x, y];
    // battery.charge = battery.charge - engine.drain;
    // robot.markModified('parts');
    await robot.save();
    cb(null, {robot: robot.serialize()})
  })
};
