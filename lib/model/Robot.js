const _ = require('lodash');
const mongoose = require('../mongoose');
const Promise = require('bluebird');

const schema = mongoose.Schema({
  name: { type: String },
  config: { type: String },
  key: { type: String },
  coords: {type: Array, of: Number, set: a => a.map((n) => Math.round(n))},
  userId: { type: 'ObjectId', ref: 'User' },
});

schema.method('serialize', function () {
  return _.pickBy(this.toJSON(), (value, key) => key !== 'secret');
});

const Robot = mongoose.model('Robot', schema, 'robots');

Promise.promisifyAll(Robot);

module.exports = Robot;
