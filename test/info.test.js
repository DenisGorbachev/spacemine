test('info', (done) => {
  client.emit('info', (info) => {
    info.name.should.equal('spacemine')
    done()
  })
})
