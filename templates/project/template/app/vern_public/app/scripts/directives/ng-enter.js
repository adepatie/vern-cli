'use strict';
angular.module('{{appName}}')
  .directive('ngEnter', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs, controller) {
        element.bind("keydown keypress", function(evt) {
          if(evt.which === 13) {
            scope.$eval(attrs.ngEnter);
            evt.preventDefault();
          }
        });
      }
    }
  })
  .directive('ngEnterAndBlur', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs, controller) {
        element.bind("keydown keypress", function(evt) {
          if(evt.which === 13) {
            element.blur();
            scope.$eval(attrs.ngEnterAndBlur);
            evt.preventDefault();
          }
        });
      }
    }
  });