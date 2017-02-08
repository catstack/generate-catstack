
module.exports = function (app){

  function create() {
    console.log('generating new catstack app!')
  }

  app.register('default', create)
  app.use(create)
}
