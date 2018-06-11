const _ = require('lodash');
const mongoose = require('../../mongoose');
const Promise = require('bluebird');

const schema = mongoose.Schema({
  tile: {type: Array, of: Number, set: a => a.map((n) => Math.round(n))},
}, {discriminatorKey: 'type'});

const Object = mongoose.model('Object', schema, 'objects');
Promise.promisifyAll(Object);

module.exports = Object;
