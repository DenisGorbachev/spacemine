const _ = require('lodash');
const Robot = require('../lib/model/Robot');

test('move', async () => {
  const {robot} = await client.emitAsync('move', {x: 1, y: 1});
  robot.tile.should.deep.equal([1, 1]);
  Robot.prototype.part.call(robot, 'battery').charge.should.equal(35);
  Robot.prototype.part.call(robot, 'battery').capacity.should.equal(50);

  await client.emitAsync('move', {}).should.eventually.be.rejected.with.property('error').that.equals('wrong-arguments');
  await client.emitAsync('move', {x: 4.5, y: 4.5}).should.eventually.be.rejected.with.property('error').that.equals('wrong-arguments');
  await client.emitAsync('move', {x: 1, y: 1}).should.eventually.be.rejected.with.property('error').that.equals('already-there');
  await client.emitAsync('move', {x: 1, y: 0}).should.eventually.be.rejected.with.property('error').that.equals('tile-occupied');
  await client.emitAsync('move', {x: 10, y: 10}).should.eventually.be.rejected.with.property('error').that.equals('insufficient-engine-range');

  await Robot.updateAsync({_id: linda._id, 'parts.type': 'battery'}, {$set: {'parts.$.charge': 0}});
  await client.emitAsync('refresh');
  await client.emitAsync('move', {x: 2, y: 2}).should.eventually.be.rejected.with.property('error').that.equals('insufficient-charge');

  await Robot.updateAsync({_id: linda._id}, {$pull: {parts: {type: 'engine'}}});
  await client.emitAsync('refresh');
  await client.emitAsync('move', {x: 2, y: 2}).should.eventually.be.rejected.with.property('error').that.equals('no-engine');

  await Robot.updateAsync({_id: linda._id}, {$pull: {parts: {type: 'battery'}}});
  await client.emitAsync('refresh');
  await client.emitAsync('move', {x: 2, y: 2}).should.eventually.be.rejected.with.property('error').that.equals('no-battery');
});
