'use strict';
angular.module('{{adminAppName}}')
  .directive('displayDataSet', function($rootScope, dataManager) {
    return {
      scope: {schema: '=', dataSet: '=displayDataSet', className: '@', displayType: '@', title: '@'},
      restrict: 'AE',
      template: '<div class="data-wrapper {{displayType}}"><h2>{{title}} <a ng-click="newObject()" href class="btn btn-success"><span class="glyphicon glyphicon-plus"></span></a></h2><div class="data-set"><display-data ng-repeat="data in dataSet" display="data" schema="schema" class-name="{{className}}" display-type="{{displayType}}"></display-data><div class="editor"><div editor-viewer></div></div></div></div>',
      replace: true,
      link: function(scope, element, attrs) {
        var setElm = element.find('.data-set');
        if(!scope.title) {
          scope.title = 'Undefined Title';
        }
        attrs.$observe('displayType', function(d) {
          scope.displayType = scope.displayType || 'list';
        });
        var elm = angular.element('<div class="data-item header"></div>');
        scope.displayType = scope.displayType || 'list';
        for(var i in scope.schema) {
          // append a directive based on type
          if(!scope.schema[i].display) {
            continue;
          }
          if(scope.schema[i].display instanceof Array && scope.schema[i].display.indexOf(scope.displayType) < 0) {
            continue;
          }
          if(typeof scope.schema[i].display === 'string' && scope.schema[i].display !== scope.displayType) {
            continue;
          }
          elm.append('<span class="' + scope.schema[i].align + '-align ' + scope.schema[i].type + ' ' + i + ' ' + scope.schema[i].className + '" >' + scope.schema[i].name + '</span>');
        }
        setElm.prepend(elm);


        $rootScope.$on('dataRefresh', function(evt, data) {
          for(var i = 0; i < scope.dataSet.length; i++) {
            if(scope.dataSet[i]._id === data._id) {
              scope.dataSet[i] = data;
              return;
            }
          }

          scope.dataSet.splice(0, 0, data);
        });

        $rootScope.$on('dataDelete', function(evt, id) {
          for(var i = 0; i < scope.dataSet.length; i++) {
            if(scope.dataSet[i]._id === id) {
              scope.dataSet.splice(i, 1);
            }
          }
        });

        scope.newObject = function() {
          var obj = {};
          for(var i in scope.schema) {
            obj[i] = scope.schema[i].default || null;
          }

          dataManager.setSelected(obj);
        };
      }
    }
  })
  .directive('displayData', function($rootScope, dataManager) {
    return {
      scope: {schema: '=', data: '=display', className: '@', displayType: '@'},
      restrict: 'AE',
      template: '<div class="data-item {{className}}"></div>',
      replace: true,
      link: function(scope, element, attrs) {
        for(var i in scope.schema) {
          // append a directive based on type
          if(!scope.schema[i].display) {
            continue;
          }
          if(scope.schema[i].display instanceof Array && scope.schema[i].display.indexOf(scope.displayType) < 0) {
            continue;
          }
          if(typeof scope.schema[i].display === 'string' && scope.schema[i].display !== scope.displayType) {
            continue;
          }
          element.append('<span class="' + scope.schema[i].align + '-align ' + scope.schema[i].type + ' ' + i + ' ' + scope.schema[i].className + '" >' + dataManager.getObjectDotNotation(scope.data, i) + '</span>');
        }

        element.on('click', function(evt) {
          dataManager.setSelected(scope.data);
          scope.$apply();
        });
      }
    }
  })
  .directive('editorViewer', function(dataManager, $compile, $rootScope) {
    return {
      restrict: 'A',
      templateUrl: function(tElm, tAttr) {
        var defaultTpl = 'template/editor-data/editor.html';
        if(tAttr.templateUrl) {
          defaultTpl = tAttr.templateUrl;
        }

        return defaultTpl;
      },
      replace: true,
      link: function(scope, element, attrs) {
        var dataHolder = element.find('.editor-data-holder');
        scope.isDeleting = false;
        scope.verb = 'Add';

        scope.getClass = function(d) {
          var obj = {};
          obj['editor-' + d.type] = true;
          return obj;
        };

        scope.closeData = function() {
          dataManager.setSelected(null);
          element.parent().removeClass('active');
        };

        scope.saveData = function() {
          dataManager.saveData(scope.data).then(function() {
            $rootScope.addAlert('success', 'Data saved successfully');
            dataManager.setSelected(null);
            element.parent().removeClass('active');
          });
        };

        scope.deleteConfirm = function() {
          console.log(scope.isDeleting);
          if(scope.isDeleting === false) {
            scope.isDeleting = true;
          } else {
            var deleteObject = angular.copy(scope.data);
            dataManager.deleteData(scope.data).then(function() {
              dataManager.setSelected(null);
              element.parent().removeClass('active');
            }).fail(function() {
              scope.isDeleting = false;
            });
          }
        };

        scope.cancelDelete = function() {
          scope.isDeleting = false;
        };

        scope.notSorted = function(obj) {
          if(!obj) {
            return [];
          }

          return Object.keys(obj);
        };
        scope.$watch(function() { return dataManager.getSelected(); }, function(data) {
          if(!data) {
            element.parent().removeClass('active');
            scope.data = null;
            return;
          }

          scope.isDeleting = false;
          if(data._id) {
            scope.verb = 'Edit';
          } else {
            scope.verb = 'Add';
          }

          element.parent().addClass('active');

          scope.data = data;
          dataHolder.empty();
          scope.schema = dataManager.getSchema();
          var elm = $compile('<div ng-repeat="key in notSorted(schema)" ng-init="d = schema[key]" ng-class="getClass(d)" scheme="d" editor-type="d.type" scheme-object="data" ng-model="data[key]" label="{{d.name}}" id="{{key}}" verb="{{verb}}"></div>')(scope);
          dataHolder.append(elm);
        });
      }
    }
  })
  .directive('editorType', function($parse, $http, $templateCache, $compile, dataManager) {
    return {
      scope: {data: '=ngModel', scheme: '=', schemeObject: '=', label: '@', type: '=editorType', id: '@', verb: '@'},
      restrict: 'A',
      link: function(scope, element, attrs) {
        scope.$watch('type', function(val) {
          if(val) {
            loadTpl(val);
          }
        });

        scope.data = dataManager.getObjectDotNotation(scope.schemeObject, scope.id);

        function loadTpl(type) {
          $http.get('template/editor-data/' + type + '.html', {cache: $templateCache})
            .success(function(html) {
              element.html(html);
            }).then(function(response) {
              element = element.replaceWith($compile(element.html())(scope));
            });
        }

        scope.$watch('data', function() {
          dataManager.setObjectDotNotation(scope.schemeObject, scope.id, scope.data);
        }, true);

        scope.doCallback = function() {
          console.log(scope.scheme);
          scope.scheme.callback(scope.schemeObject);
        };
      }
    }
  });

angular.module('{{adminAppName}}').run(['$templateCache', function($templateCache) {
  $templateCache.put('template/editor-data/editor.html',
      '<div class="editor-data"><h3>{{verb}}</h3><div class="editor-actions"><a href class="save btn btn-primary" ng-click="saveData()"><span class="glyphicon glyphicon-save"></span> Save</a> <a href class="btn btn-default" ng-click="closeData()"><span class="glyphicon glyphicon-remove"></span></a></div><div class="editor-data-holder"></div><div class="delete-holder" ng-show="verb == \'Edit\'"><button class="delete btn btn-danger" ng-click="deleteConfirm()"><span ng-class="{active: isDeleting == false}">Delete</span><span ng-class="{active: isDeleting == true}">Click again to confirm</span></button> <button class="btn btn-default" ng-show="isDeleting == true" ng-click="cancelDelete()">Cancel</button></div></div>');
}]);

angular.module('{{adminAppName}}').run(['$templateCache', function($templateCache) {
  $templateCache.put('template/editor-data/text.html',
    '<div class="form-group" ng-show="scheme.verbs.indexOf(verb) > -1"><label ng-bind="label"></label><input class="form-control" type="text" ng-model="data"></div>');
}]);

angular.module('{{adminAppName}}').run(['$templateCache', function($templateCache) {
  $templateCache.put('template/editor-data/email.html',
    '<div class="form-group" ng-show="scheme.verbs.indexOf(verb) > -1"><label ng-bind="label"></label><input class="form-control" type="email" ng-model="data"></div>');
}]);

angular.module('{{adminAppName}}').run(['$templateCache', function($templateCache) {
  $templateCache.put('template/editor-data/password.html',
    '<div class="form-group" ng-show="scheme.verbs.indexOf(verb) > -1"><label ng-bind="label"></label><input class="form-control" type="password" ng-model="data" ng-init="data = \'\'"></div>');
}]);

angular.module('{{adminAppName}}').run(['$templateCache', function($templateCache) {
  $templateCache.put('template/editor-data/currency.html',
    '<div class="form-group" ng-show="scheme.verbs.indexOf(verb) > -1"><label ng-bind="label"></label><input class="form-control" type="text" ng-model="data"></div>');
}]);

angular.module('{{adminAppName}}').run(['$templateCache', function($templateCache) {
  $templateCache.put('template/editor-data/toggle.html',
    '<div class="form-group" ng-show="scheme.verbs.indexOf(verb) > -1"><input type="checkbox" ng-model="data" id="{{id}}"><label for="{{id}}" ng-bind="label"></label></div>');
}]);

angular.module('{{adminAppName}}').run(['$templateCache', function($templateCache) {
  $templateCache.put('template/editor-data/select.html',
    '<div class="form-group" ng-show="scheme.verbs.indexOf(verb) > -1"><label ng-bind="label"></label><select class="form-control" ng-model="data" ng-options="option.value as option.name for option in scheme.options"><option value>Select One</option></select></div>');
}]);

angular.module('{{adminAppName}}').run(['$templateCache', function($templateCache) {
  $templateCache.put('template/editor-data/button.html',
    '<div class="form-group" ng-show="scheme.verbs.indexOf(verb) > -1"><button class="btn btn-default" ng-click="doCallback()">{{label}}</button></div>');
}]);