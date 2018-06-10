const _ = require('lodash');
const mongoose = require('../mongoose');
const Promise = require('bluebird');
const bcrypt = require("bcrypt");

const schema = mongoose.Schema({
  name: {type: String},
  key: {type: String},
  secret: {type: String, set: v => bcrypt.hashSync(v, 12)},
  x: {type: Number, required: true, get: v => Math.round(v), set: v => Math.round(v)},
  y: {type: Number, required: true, get: v => Math.round(v), set: v => Math.round(v)},
  parts: [mongoose.Schema.Types.Mixed]
});

schema.method('part', function(type) {
  return _.find(this.parts, {type});
});

schema.method('partWithIndex', function(type) {
  const index = _.findKey(this.parts, {type});
  return {index, part: this.parts[index]};
});

const Robot = mongoose.model('Robot', schema, 'objects')
Promise.promisifyAll(Robot);

module.exports = Robot;
