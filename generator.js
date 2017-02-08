'use strict';
var mkdir = require('mkdirp').sync
var path = require('path')
var isValid = require('is-valid-app')

module.exports = function(app) {
  if (!isValid(app, 'generate-catstack')) return;

  /**
   * Plugins
   */

  app.use(require('generate-defaults'));

  /**
   * Scaffold out a(n) catstack project. Also aliased as the [default](#default) task.
   *
   * ```sh
   * $ gen catstack:catstack
   * ```
   * @name catstack
   * @api public
   */

  app.task('new', function() {
    
  });
  app.task('domain', function(cb) {
    mkdir(path.join(app.cwd, app.options.name))
    cb(null)
  });
  app.task('effect', function() {
    
  });
  app.task('action', function() {
    
  });
  app.task('helper', function() {
    
  });
  app.task('page', function() {
    
  });
  app.task('element', function() {
    
  });
  //task(app, 'generator', ['generatorjs', 'index', 'install']);

};

/**
 * Create a task with the given `name` and glob `pattern`
 */

function task(app, name, pattern, dependencies) {
  app.task(name, dependencies || [], function(cb) {
    return file(app, pattern);
  });
}

function file(app, pattern) {
  var opts = extend({}, app.base.options, app.options);
  var srcBase = opts.srcBase || path.join(__dirname, 'templates');
  return app.src(pattern, {cwd: srcBase})
    .pipe(app.renderFile('*', app.base.cache.data))
    .pipe(app.conflicts(app.cwd))
    .pipe(app.dest(app.cwd));
}
