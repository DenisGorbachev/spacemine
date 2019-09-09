const Robot = require('../lib/model/Robot')
const Component = require('../lib/model/Robot')

test('scan', async () => {
  const { objects } = await client.emitAsync('scan', {})
  objects.should.containSubset([{ name: 'Bart' }])
  objects.should.not.containSubset([{ name: 'Linda' }])

  await client.emitAsync('scan', { invalidArg: true }).should.eventually.be.rejected.with.property('error').that.equals('wrong-arguments')

  await Robot.updateAsync({ _id: linda._id, 'parts.type': 'battery' }, { $set: { 'parts.$.charge': 0 } })
  await client.emitAsync('refresh')
  await client.emitAsync('scan', {}).should.eventually.be.rejected.with.property('error').that.equals('insufficient-charge')

  await Robot.updateAsync({ _id: linda._id }, { $pull: { parts: { type: 'scanner' } } })
  await client.emitAsync('refresh')
  await client.emitAsync('scan', {}).should.eventually.be.rejected.with.property('error').that.equals('no-scanner')

  await Robot.updateAsync({ _id: linda._id }, { $pull: { parts: { type: 'battery' } } })
  await client.emitAsync('refresh')
  await client.emitAsync('scan', {}).should.eventually.be.rejected.with.property('error').that.equals('no-battery')
})
