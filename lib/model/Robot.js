const mongoose = require('../mongoose');
const bcrypt = require("bcrypt");

module.exports = mongoose.model('Robot', mongoose.Schema({
  name: {type: String},
  key: {type: String},
  secret: {type: String, set: v => bcrypt.hashSync(v, 12)},
  x: {type: Number, get: v => Math.round(v), set: v => Math.round(v)},
  y: {type: Number, get: v => Math.round(v), set: v => Math.round(v)}
}), 'objects');
