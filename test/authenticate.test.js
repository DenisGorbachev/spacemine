test('InvalidUsername', (done) => {
  client.emit('authentication', { username: 'invalid-username', password: 'invalid-password' });
  client.on('unauthorized', function (err) {
    if (err) done();
  });
});

test('InvalidPassword', (done) => {
  client.emit('authentication', { username: 'alice', password: 'invalid-password' });
  client.on('unauthorized', function (err) {
    if (err) done();
  });
});

test('Alice', (done) => {
  client.emit('authentication', { username: 'alice', password: '123123' });
  client.on('authenticated', function (data) {
    data.should.equal(true);
    done();
  });
});
