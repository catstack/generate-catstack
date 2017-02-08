var test = require('tape')
var generate = require('generate')
var path = require('path')
var exists = require('is-there')
var tmp = require('tmp')
var generator = require('../')


test('generate-catstack should add tasks to the instance', function(t) {
  var app = generate()

  app.use(generator);
  t.true(app.tasks.hasOwnProperty('new'))
  t.true(app.tasks.hasOwnProperty('domain'))
  t.true(app.tasks.hasOwnProperty('effect'))
  t.true(app.tasks.hasOwnProperty('action'))
  t.true(app.tasks.hasOwnProperty('helper'))
  t.true(app.tasks.hasOwnProperty('page'))
  t.true(app.tasks.hasOwnProperty('element'))

  t.end()
})

test('should only register the plugin once', function(t) {
  t.plan(1)
  var app = generate()
  app.on('plugin', function(name) {
    if (name === 'generate-catstack') {
      t.ok(true)
    }
  })
  app.use(generator);
  app.use(generator);
  app.use(generator);
})

test('domain creates folder with name passed as option', function(t) {

  var temp = tmp.dirSync() 
  var tempPath = temp.name
  var domainName = 'piet'
  var domainPath = path.join(tempPath, domainName)

  var app = generate()
  app.cwd = tempPath
  app.options.name = domainName 
  app.use(generator)
  app.generate('catstack:domain', function(err) {
    t.error(err)
    t.ok(exists(domainPath))
    t.end()
  })
})
