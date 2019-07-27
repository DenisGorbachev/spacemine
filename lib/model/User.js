const _ = require('lodash');
const mongoose = require('../mongoose');
const Promise = require('bluebird');
const bcrypt = require('bcrypt');

const schema = mongoose.Schema({
  email: { type: String },
  username: { type: String },
  password: { type: String, set: v => bcrypt.hashSync(v, 12) },
});

schema.method('serialize', function () {
  return _.pickBy(this.toJSON(), (value, key) => key !== 'secret');
});

const User = mongoose.model('User', schema, 'users');

Promise.promisifyAll(User);

module.exports = User;
