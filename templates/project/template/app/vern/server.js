/*

 Built by
    __                   ____
   / /___  ______  ___  / __/___  ____
  / __/ / / / __ \/ _ \/ /_/ __ \/ __ \
 / /_/ /_/ / /_/ /  __/ __/ /_/ / /_/ /
 \__/\__, / .___/\___/_/  \____/\____/
    /____/_/
 */

var argv = require('optimist')
  .usage('Usage: $0 -e [string]')
  .default('e', 'development')
  .argv;

var vern = require('vern-core');

new vern().then(function($vern) {
  // Load vern external modules here
  // $vern = require('vern-authentication')($vern);


  // Load framework controllers and models
  $vern.loadControllers('./controllers');
  $vern.loadModels('./models');

  // Init your controllers
  $vern.controllers.index = new $vern.controllers.IndexController($vern).init({
    publicRoute: '/index'
  });
}).fail(function(err) {
    console.log(err);
    console.log(err.stack);
    // you could have email or push notifications here.
    //
    // or exit
    process.exit(1);
  });