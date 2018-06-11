const mongoose = require('./mongoose');

module.exports = async function() {
  await mongoose.connection.collections.objects.ensureIndex({coords: '2d'}, {unique: true, sparse: true, background: false});
};
