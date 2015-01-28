var vern = require('vern-core');

new vern().then(function($vern) {
  $vern = require('../lib/index.js')($vern);
}).fail(function(err) {
  console.log(err);
  console.log(err.stack);
});