test('move', (done) => {
  client.emit('move', {}, function(result) {
    result.error.should.equal('wrong-arguments');
    done();
  });
  client.emit('move', {x: 4.5, y: 4.5}, function(result) {
    result.error.should.equal('wrong-arguments');
    done();
  });
  client.emit('move', {x: 0, y: 0}, function(result) {
    result.error.should.equal('already-there');
    done();
  });
  client.emit('move', {x: 10, y: 10}, function(result) {
    result.error.should.equal('insufficient-engine-range');
    done();
  });
  client.emit('move', {x: 1, y: 1}, function(result) {
    result.x.should.equal(1);
    result.y.should.equal(1);
    done();
  });
});
