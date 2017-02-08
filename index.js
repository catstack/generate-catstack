
module.exports = function (app){

  function create() {
    console.log('generating new catstack app!')
  }

  function domain() {
    console.log('generating new catstack domain!')
    console.log(app.options.name)
  }

  app.task('new', domain)
  app.task('domain', domain)
  app.task('action', domain)
  app.task('effect', domain)
  app.task('page', domain)
  app.task('element', domain)
  app.task('helper', domain)
}
