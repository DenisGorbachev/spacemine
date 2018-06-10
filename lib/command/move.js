const _ = require('lodash');
const Joi = require('joi');
const schema = Joi.object({
  x: Joi.number().integer(),
  y: Joi.number().integer(),
});

module.exports = function(socket) {
  socket.on('move', async function(params, cb) {
    const {error} = schema.validate(params, {presence: 'required'});
    if (error) return cb({error: 'wrong-arguments', details: error.details});
    const {x, y} = params;
    const {robot} = socket.client;
    if (robot.x === x && robot.y === y) return cb({error: 'already-there'});
    const engine = robot.part('engine');
    if (!engine) return cb({error: 'no-engine'});
    const battery = robot.part('battery');
    if (!battery) return cb({error: 'no-battery'});
    const range = Math.sqrt(Math.pow(x - robot.x, 2) + Math.pow(y - robot.y, 2));
    if (range > engine.range) return cb({error: 'insufficient-engine-range', range: engine.range});
    if (engine.drain > battery.charge) return cb({error: 'insufficient-charge', drain: engine.drain, charge: battery.charge});
    robot.x = x;
    robot.y = y;
    battery.charge = battery.charge - engine.drain;
    robot.markModified('parts');
    await robot.save();
    cb(null, {x, y, battery: _.pick(battery, ['charge', 'capacity'])})
  })
};
