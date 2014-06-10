/**
 * Description for {{controller_name}}
 *
 * @class {{controller_name}}
 * @constructor
 */
function {{controller_name}}($parent) {
  var validator      = require('validator');

  var $scope = new $parent.controller({{controller_name}});
  return $scope;
}

module.exports = {{controller_name}};