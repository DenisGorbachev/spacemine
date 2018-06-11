const mongoose = require('./mongoose');

module.exports = async function() {
  await mongoose.connection.collections.objects.ensureIndex({tile: '2d'}, {unique: true, background: false});
  // await mongoose.connection.collections.objects.ensureIndex({key: 1}, {unique: true, sparse: true, background: false});
};
