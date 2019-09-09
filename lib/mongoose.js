const config = require('config')
const mongoose = require('mongoose')

mongoose.connectWithConfig = function () {
  return this.connect(config.get('mongodb'), {
    useNewUrlParser: true,
    keepAlive: 1000,
    connectTimeoutMS: 30000,
    reconnectTries: 15,
    reconnectInterval: 5000,
  })
}

module.exports = mongoose
