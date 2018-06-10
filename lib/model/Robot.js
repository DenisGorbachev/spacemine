const _ = require('lodash');
const mongoose = require('../mongoose');
const bcrypt = require("bcrypt");

const schema = mongoose.Schema({
  name: {type: String},
  key: {type: String},
  secret: {type: String, set: v => bcrypt.hashSync(v, 12)},
  x: {type: Number, required: true, get: v => Math.round(v), set: v => Math.round(v)},
  y: {type: Number, required: true, get: v => Math.round(v), set: v => Math.round(v)},
  parts: [new mongoose.Schema({
    type: {type: String}
  }, {strict: false})]
});

schema.method('part', function(type) {
  return _.find(this.parts, {type});
});

module.exports = mongoose.model('Robot', schema, 'objects');
