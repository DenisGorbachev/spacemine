const mongoose = require('./mongoose');

module.exports = async function () {
  await mongoose.connection.collections.robots.createIndexes([
    {
      name: 'coords',
      key: { coords: '2d' },
      unique: true,
      background: false
    }
  ]);
  return mongoose;
};
