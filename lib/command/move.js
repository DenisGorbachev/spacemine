const Joi = require('joi');
const schema = Joi.object({
  x: Joi.number().integer(),
  y: Joi.number().integer(),
});

module.exports = function(socket) {
  socket.on('move', function(params, cb) {
    const {error} = schema.validate(params, {presence: 'required'});
    if (error) return cb({error: 'wrong-arguments', details: error.details});
    const {x, y} = params;
    const {robot} = socket.client;
    if (robot.x === x && robot.y === y) return cb({error: 'already-there'});
    const engine = robot.part('engine');
    if (!engine) return cb({error: 'no-engine'});
    const range = Math.sqrt(Math.pow(x - robot.x, 2) + Math.pow(y - robot.y, 2));
    console.log(range);
    if (range < engine.range) return cb({error: 'insufficient-engine-range', range: engine.range});
    console.log('there');
  })
};
