const mongoose = require('./mongoose');

module.exports = async function () {
  await mongoose.connection.collections.robots.createIndex({ coords: '2d' },
    {
      name: 'coords',
      unique: true,
      background: true
    }
  );

  return mongoose;
};
