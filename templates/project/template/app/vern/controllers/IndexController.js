/**
* Startup functions and default endpoints
*
* @class IndexController
* @constructor
*/
function IndexController($vern) {
  var validator      = require('validator');

  var $scope = new $vern.controller(IndexController);

  return $scope;
}

module.exports = IndexController;