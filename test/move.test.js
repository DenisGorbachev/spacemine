const Robot = require('../lib/model/Robot');

test('move', async () => {
  const result = await client.emitAsync('move', {x: 1, y: 1});
  result.x.should.equal(1);
  result.y.should.equal(1);
  result.battery.charge.should.equal(35);
  result.battery.capacity.should.equal(50);
  await client.emitAsync('move', {}).should.eventually.be.rejected.with.property('error').that.equals('wrong-arguments');
  await client.emitAsync('move', {x: 4.5, y: 4.5}).should.eventually.be.rejected.with.property('error').that.equals('wrong-arguments');
  await client.emitAsync('move', {x: 1, y: 1}).should.eventually.be.rejected.with.property('error').that.equals('already-there');
  await client.emitAsync('move', {x: 10, y: 10}).should.eventually.be.rejected.with.property('error').that.equals('insufficient-engine-range');
  await Robot.updateAsync({key: 'LindaKey', 'parts.type': 'battery'}, {$set: {'parts.$.charge': 0}});
  await client.emitAsync('refresh');
  await client.emitAsync('move', {x: 2, y: 2}).should.eventually.be.rejected.with.property('error').that.equals('insufficient-charge');
  await Robot.updateAsync({key: 'LindaKey'}, {$pull: {parts: {type: 'battery'}}});
  await client.emitAsync('refresh');
  await client.emitAsync('move', {x: 2, y: 2}).should.eventually.be.rejected.with.property('error').that.equals('no-battery');
  await Robot.updateAsync({key: 'LindaKey'}, {$pull: {parts: {type: 'engine'}}});
  await client.emitAsync('refresh');
  await client.emitAsync('move', {x: 2, y: 2}).should.eventually.be.rejected.with.property('error').that.equals('no-engine');
});
