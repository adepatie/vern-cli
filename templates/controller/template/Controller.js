/**
 * Description for {{controller_name}}
 *
 * @class {{controller_name}}
 * @constructor
 */
function {{controller_name}}($vern) {
  var validator      = require('validator');

  var $scope = new $vern.controller({{controller_name}});
  {{model_declaration}}

  return $scope;
}

module.exports = {{controller_name}};