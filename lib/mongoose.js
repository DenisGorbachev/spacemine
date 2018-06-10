const config = require('config');
const mongoose = require('mongoose');

mongoose.connect(config.get('mongodb'));

module.exports = mongoose;
