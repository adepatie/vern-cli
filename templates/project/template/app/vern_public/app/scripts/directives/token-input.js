'use strict';
angular.module('{{appName}}')
  .directive('tokenInput', function($rootScope, $compile, apiRequest, $q) {
    return {
      restrict: 'AE',
      scope: { tokens: '=ngModel', onUpdate: '&onUpdate', autocomplete: '@', tagCloud: '@' },
      replace: false,
      template: function(tElement, tAttrs) {
        var typeaheads = '';
        for(var i in tAttrs) {
          if(i.indexOf('typeahead-') >= 0) {
            typeaheads += ' ' + i + '="' + tAttrs[i] + '"';
          }
        }

        if(tAttrs.tagCloud) {
          tAttrs.autocomplete = 'tag for tag in getTags($viewValue)';
        }

        if(!tAttrs.placement || (tAttrs.placement && tAttrs.placement === 'top')) {
          return  '<div class="ngTokenInput {{ options.cssClass }}">' +
            '  <ul class="top-placement">' +
            '    <li ng-repeat="token in tokens">' +
            '      <span>{{token}} <i class="glyphicon glyphicon-remove" ng-click="removeToken($index)"></i></span>' +
            '    </li>' +
            '  </ul>' +
            (tAttrs.autocomplete ? '  <input type="text" class="form-control" data-min-length="0" typeahead-min-length="0" placeholder="{{options.placeholder}}" ng-model="tokenText" typeahead="' + tAttrs.autocomplete + '"' + typeaheads + ' typeahead-on-select="selectAutoComplete($item, $model, $label)">' : '  <input type="text" class="form-control" data-min-length="0" placeholder="{{options.placeholder}}" ng-model="tokenText">') +
            '</div>';
        } else if(tAttrs.placement && tAttrs.placement === 'bottom') {
          return  '<div class="ngTokenInput {{ options.cssClass }}">' +
            (tAttrs.autocomplete ? '  <input type="text" class="form-control" data-min-length="0" typeahead-min-length="0" placeholder="{{options.placeholder}}" ng-model="tokenText" typeahead="' + tAttrs.autocomplete + '"' + typeaheads + ' typeahead-on-select="selectAutoComplete($item, $model, $label)">' : '  <input type="text" class="form-control" data-min-length="0" placeholder="{{options.placeholder}}" ng-model="tokenText">') +
            '  <ul class="bottom-placement">' +
            '    <li ng-repeat="token in tokens">' +
            '      <span>{{token}} <i class="glyphicon glyphicon-remove" ng-click="removeToken($index)"></i></span>' +
            '    </li>' +
            '  </ul>' +
            '</div>';
        }
      },
      controller: function($scope, $element, $attrs) {
        $scope.tokens = $scope.tokens || [];
        $scope.tokenText = '';
        $scope.options = {
          placeholder: $attrs.placeholder || 'Add a Token',
          cssClass: $attrs.cssClass || '',
          maxTokens: parseInt($attrs.maxTokens)
        };

        if(typeof $scope.autocomplete === 'undefined') {
          $scope.autocomplete = null;
        }

        $scope.addTagToCloud = function(tag) {
          apiRequest.post({
            path: 'tags',
            data: {type: $scope.tagCloud, name: tag},
            success: function(res) {
            }
          });
        };

        $scope.$watch('tokens', function() {
          if(!($scope.tokens instanceof Array)) {
            $scope.tokens = [];
          }
        }, true);

        var updateHandler = $scope.onUpdate;
        if(!updateHandler) {
          updateHandler = function() {};
        }

        $scope.addToken = function(t) {
          if(!t || !t.length) {
            return;
          }
          if($scope.options.maxTokens > 0 && $scope.tokens.length >= $scope.options.maxTokens) {
            return;
          }
          if($scope.tokens.indexOf(t) === -1) {
            $scope.tokens.push(t);
            $scope.tokenText = '';
            if($scope.tagCloud) {
              $scope.addTagToCloud(t);
            }
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

        scope.selectAutoComplete = function($item, $model, $label) {
          scope.addToken($item);
        };

        scope.getTags = function(val) {
          return apiRequest.get({
            path: 'tags',
            data: {conditions: {type: scope.tagCloud}, search: {value: val.toLowerCase()}}
          }).then(function(data) {
            var res = data.data;
            var tags = [];
            for(var i = 0; i < res.pkg.data.length; i++) {
              tags.push(res.pkg.data[i].name);
            }

            return tags;
          });
        };
      }
    };
  });