'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var generate = require('generate');
var npm = require('npm-install-global');
var del = require('delete');
var pkg = require('../package');
var generator = require('..');
var app;

var isTravis = process.env.CI || process.env.TRAVIS;
var fixtures = path.resolve.bind(path, __dirname, 'fixtures');
var actual = path.resolve.bind(path, __dirname, 'actual');

function exists(name, cb) {
  return function(err) {
    if (err) return cb(err);
    var filepath = actual(name);

    fs.stat(filepath, function(err, stat) {
      if (err) return cb(err);
      assert(stat);
      del(actual(), cb);
    });
  };
}

describe('generate-catstack', function() {
  this.slow(250);

  if (!process.env.CI && !process.env.TRAVIS) {
    before(function(cb) {
      npm.maybeInstall('generate', cb);
    });
  }

  beforeEach(function() {
    app = generate({silent: true});
    app.cwd = actual();
    app.option('dest', actual());

    // see: https://github.com/jonschlinkert/ask-when
    app.option('askWhen', 'not-answered');

    // set default data to use in templates. feel free to remove anything
    // that isn't used (e.g. if "username" isn't defined in templates, just remove it)
    app.data(pkg);
    app.data('project', pkg);
    app.data('username', 'foo');
    app.data('owner', 'foo');
  });

  afterEach(function(cb) {
    del(actual(), cb);
  });

  describe('tasks', function() {
    it('should extend tasks onto the instance', function() {
      app.use(generator);
      assert(app.tasks.hasOwnProperty('default'));
      assert(app.tasks.hasOwnProperty('catstack'));
    });

    it('should run the `default` task with .build', function(cb) {
      app.use(generator);
      app.build('default', exists('', cb));
    });

    it('should run the `default` task with .generate', function(cb) {
      app.use(generator);
      app.generate('default', exists('', cb));
    });
  });

  describe('catstack (CLI)', function() {
    it('should run the default task using the `generate-catstack` name', function(cb) {
      if (isTravis) {
        this.skip();
        return;
      }
      app.use(generator);
      app.generate('generate-catstack', exists('test.js', cb));
    });

    it('should run the default task using the `generator` generator alias', function(cb) {
      if (isTravis) {
        this.skip();
        return;
      }
      app.use(generator);
      app.generate('catstack', exists('test.js', cb));
    });
  });

  describe('catstack (API)', function() {
    it('should run the default task on the generator', function(cb) {
      app.register('catstack', generator);
      app.generate('catstack', exists('test.js', cb));
    });

    it('should run the `catstack` task', function(cb) {
      app.register('catstack', generator);
      app.generate('catstack:catstack', exists('test.js', cb));
    });

    it('should run the `default` task when defined explicitly', function(cb) {
      app.register('catstack', generator);
      app.generate('catstack:default', exists('test.js', cb));
    });
  });

  describe('sub-generator', function() {
    it('should work as a sub-generator', function(cb) {
      app.register('foo', function(foo) {
        foo.register('catstack', generator);
      });
      app.generate('foo.catstack', exists('test.js', cb));
    });

    it('should run the `default` task by default', function(cb) {
      app.register('foo', function(foo) {
        foo.register('catstack', generator);
      });
      app.generate('foo.catstack', exists('test.js', cb));
    });

    it('should run the `generator:default` task when defined explicitly', function(cb) {
      app.register('foo', function(foo) {
        foo.register('catstack', generator);
      });
      app.generate('foo.catstack:default', exists('test.js', cb));
    });

    it('should run the `generator:catstack` task', function(cb) {
      app.register('foo', function(foo) {
        foo.register('catstack', generator);
      });
      app.generate('foo.catstack:catstack', exists('test.js', cb));
    });

    it('should work with nested sub-generators', function(cb) {
      app
        .register('foo', generator)
        .register('bar', generator)
        .register('baz', generator)

      app.generate('foo.bar.baz', exists('test.js', cb));
    });

    it('should run tasks as a sub-generator', function(cb) {
      app = generate({silent: true, cli: true});

      app.generator('foo', function(sub) {
        sub.register('catstack', require('..'));
        sub.generate('catstack:unit-test', function(err) {
          if (err) return cb(err);
          assert.equal(app.base.get('cache.unit-test'), true);
          cb();
        });
      });
    });
  });
});
