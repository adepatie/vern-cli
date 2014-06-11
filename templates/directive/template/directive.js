'use strict';
angular.module('VernApp')
  .directive('{{directive_name}}', function() {
    return {
      scope: {},
      restrict: '{{restrictions}}',
      templateUrl: function(tElement, tAttrs) {
        var url = '{{template_url}}';
        if(tAttrs.templateUrl) {
          url = tAttrs.templateUrl;
        }

        return url;
      },
      link: function(scope, element, attrs) {

      }
    }
  });

angular.module('VernApp').run(['$templateCache', function($templateCache) {
  $templateCache.put('{{template_url}}',
      '<div class="{{name}}">' +
      '</div>'
  );
}]);