'use strict';
angular.module('{{adminAppName}}')
  .directive('tokenInput', function($rootScope, $compile) {
    return {
      restrict: 'AE',
      scope: { tokens: '=ngModel', onUpdate: '&onUpdate', autocomplete: '=?autocomplete' },
      replace: false,
      template: '<div class="ngTokenInput {{ options.cssClass }}">' +
                '  <ul>' +
                '    <li ng-repeat="token in tokens">' +
                '      <span>{{token}} <i class="icon icon-times" ng-click="removeToken($index)"></i></span>' +
                '    </li>' +
                '  </ul>' +
                '  <input type="text" data-min-length="0" placeholder="{{options.placeholder}}" tabindex="-1" ng-model="tokenText" bs-typeahead="autocomplete">' +
                '</div>',
      controller: function($scope, $attrs) {
        $scope.tokens = $scope.tokens || [];
        $scope.tokenText = '';
        $scope.options = {
          placeholder: $attrs.placeholder || 'Add a Token',
          cssClass: $attrs.cssClass || '',
          maxTokens: parseInt($attrs.maxTokens)
        };

        if(typeof $attrs.autocomplete !== 'undefined') {
          $scope.autocomplete = $scope.autocomplete || [];
        } else {
          $scope.autocomplete = null;
        }

        var updateHandler = $scope.onUpdate;
        if(!updateHandler) {
          updateHandler = function() {};
        }
        
        $scope.addToken = function(t) {
          if($scope.options.maxTokens > 0 && $scope.tokens.length >= $scope.options.maxTokens) {
            return;
          }
          if($scope.tokens.indexOf(t) === -1) {
            $scope.tokens.push(t);
            $scope.tokenText = '';
          }
          updateHandler($scope.tokens);
        };
        
        $scope.removeToken = function(i) {
          $scope.tokens.splice(i, 1);
          updateHandler($scope.tokens);
        };
      },
      link: function(scope, elm, attrs, tokenCtrl) {
        var ENTER = 13, COMMA = 188, BACKSPACE = 8;

        elm.find('input').bind('keydown', function(e) {
          if (e.keyCode === ENTER ||e.keyCode === COMMA) {
            scope.addToken(scope.tokenText);
            e.preventDefault();
            scope.$apply();
          } else if (e.keyCode === BACKSPACE && scope.tokenText.length === 0) {
            if(scope.tokens.length > 0) {
              scope.removeToken(scope.tokens.length-1);
              e.preventDefault();
              scope.$apply();
            }
          }
        });

        elm.find('input').on('focus', function(e) {
          if(!scope.autocomplete) {
            return;
          }
          var autocomplete = elm.find('.typeahead');
          if(autocomplete.length <= 0) {
            return;
          }

          if(scope.autocomplete.indexOf(scope.tokenText) > -1 && scope.tokens.indexOf(scope.tokenText) === -1) {
            scope.addToken(scope.tokenText);
            e.preventDefault();
            elm.find('input').trigger('blur');
            scope.$apply();
          }
        });
      }
    };
  });