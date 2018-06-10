test('InvalidKey', (done) => {
  client.emit('authentication', {key: "InvalidKey", secret: "InvalidSecret"});
  client.on('unauthorized', function(err) {
    if (err) done();
  });
});

test('InvalidSecret', (done) => {
  client.emit('authentication', {key: "valid-key", secret: "InvalidSecret"});
  client.on('unauthorized', function(err) {
    if (err) done();
  });
});

test('LindaKey', (done) => {
  client.emit('authentication', {key: "LindaKey", secret: "LindaSecret"});
  client.on('authenticated', function(data) {
    data.should.equal(true);
    done();
  });
});
