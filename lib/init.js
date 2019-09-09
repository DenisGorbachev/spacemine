const mongoose = require('./mongoose')

export default async function () {
  await mongoose.connectWithConfig()
  await mongoose.connection.collections.robots.createIndex({ coords: '2d' }, {
    name: 'coords',
    unique: true,
    background: true,
  })
  return mongoose
}
