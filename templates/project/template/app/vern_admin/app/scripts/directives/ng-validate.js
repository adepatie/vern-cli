'use strict';
angular.module('{{adminAppName}}')
  .directive('ngValidate', function($rootScope, $compile) {
    return {
      restrict: 'A',
      scope: true,
      require: ['ngModel', '^form'],
      replace: false,
      link: function(scope, elm, attrs, ctrl) {
        var type = elm[0].tagName.toLowerCase();
        var defaultMessage = 'Invalid ' + attrs.type;
        if(type === 'select') {
          defaultMessage = 'Invalid selection';
        }
        if(attrs.type === 'checkbox' || attrs.type === 'radio') {
          defaultMessage = 'Invalid selection';
        }

        scope.message = attrs.ngValidate || defaultMessage;
        var errorLabel = angular.element('<p class="alert">' + scope.message + '</p>').addClass('hide');
        elm.after(errorLabel);

        elm.on('keydown', function() {
          if(ctrl[0].$valid) {
            errorLabel.addClass('hide');
            errorLabel.removeClass('alert-error');
          }
        });
        elm.on('change', function() {
          if(!ctrl[0].$valid) {
            errorLabel.removeClass('hide');
            errorLabel.addClass('alert-error');
          } else {
            errorLabel.addClass('hide');
            errorLabel.removeClass('alert-error');
          }
        });

        scope.$on('invalidForm', function(evt, form) {
          if(!ctrl[0].$valid) {
            errorLabel.removeClass('hide');
            errorLabel.addClass('alert-error');
          } else {
            errorLabel.addClass('hide');
            errorLabel.removeClass('alert-error');
          }
        });
      }
    };
  });