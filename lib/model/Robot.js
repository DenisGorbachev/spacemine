const _ = require('lodash');
const mongoose = require('../mongoose');
const Promise = require('bluebird');
const bcrypt = require("bcrypt");
const Object = require('./base/Object');

const schema = mongoose.Schema({
  name: {type: String},
  key: {type: String},
  secret: {type: String, set: v => bcrypt.hashSync(v, 12)},
  // x: {type: Number, required: true, get: v => , set: v => Math.round(v)},
  // y: {type: Number, required: true, get: v => Math.round(v), set: v => Math.round(v)},
  parts: [mongoose.Schema.Types.Mixed]
});

schema.method('part', function(type) {
  return _.find(this.parts, {type});
});

schema.method('partWithIndex', function(type) {
  const index = _.findKey(this.parts, {type});
  return {index, part: this.parts[index]};
});

schema.method('serialize', function() {
  return _.pickBy(this.toJSON(), (value, key) => key !== 'secret');
});

const Robot = Object.discriminator('Robot', schema);
Promise.promisifyAll(Robot);

module.exports = Robot;
