'use strict';

//https://github.com/django/django/blob/master/django/contrib/admin/static/admin/js/urlify.js
var charMap = {
  '€': 'euro', '₢': 'cruzeiro', '₣': 'french franc', '£': 'pound',
  '₤': 'lira', '₥': 'mill', '₦': 'naira', '₧': 'peseta', '₨': 'rupee',
  '₩': 'won', '₪': 'new shequel', '₫': 'dong', '₭': 'kip', '₮': 'tugrik',
  '₯': 'drachma', '₰': 'penny', '₱': 'peso', '₲': 'guarani', '₳': 'austral',
  '₴': 'hryvnia', '₵': 'cedi', '¢': 'cent', '¥': 'yen', '元': 'yuan',
  '円': 'yen', '﷼': 'rial', '₠': 'ecu', '¤': 'currency', '฿': 'baht',
  "$": 'dollar',
  // symbols
  '©':'(c)', 'œ': 'oe', 'Œ': 'OE', '∑': 'sum', '®': '(r)', '†': '+',
  '“': '"', '”': '"', '‘': "'", '’': "'", '∂': 'd', 'ƒ': 'f', '™': 'tm',
  '℠': 'sm', '…': '...', '˚': 'o', 'º': 'o', 'ª': 'a', '•': '*',
  '∆': 'delta', '∞': 'infinity', '♥': 'love', '&': 'and', '|': 'or',
  '<': 'less', '>': 'greater'
};

function slugify(string, replacement) {
  if(!string) {
    return '';
  }
  replacement = replacement || '-';
  var result = '';
  for (var i=0; i < string.length; i++) {
    var ch = string[i];
    if (charMap[ch]) {
      ch = charMap[ch];
    }
    ch = ch.replace(/[^\w\s$\*\_\+~\.\(\)\'\"\!\-:@]/g, '');
    result += ch;
  }
  result = result.replace(/^\s+|\s+$/g, '');
  result = result.replace(/[-\s]+/g, replacement);
  result.replace("#{replacement}$", '');
  return result;
}

function trim(string, length, ellipsis) {
  if(!string) {
    return '';
  }
  ellipsis = ellipsis ? ellipsis : '...';
  if(string.length < length) {
    return string;
  } else {
    return (string.substr(0, length) + ellipsis).replace(/^\s+|\s+$/g, '');
  }
}

angular.module('{{appName}}')
  .directive('displayDataSet', function($rootScope, dataManager) {
    return {
      scope: {schema: '=', dataSet: '=displayDataSet', className: '@', displayType: '@', title: '@'},
      restrict: 'AE',
      template: '<div class="data-wrapper {{displayType}}"><h2>{{title}} <a ng-click="newObject()" href class="btn btn-success"><span class="glyphicon glyphicon-plus"></span></a></h2><div class="data-set"><display-data ng-repeat="data in dataSet" display="data" schema="schema" class-name="{{className}}" display-type="{{displayType}}"></display-data><div class="editor"><div editor-viewer></div></div></div></div>',
      replace: true,
      link: function(scope, element, attrs) {
        var setElm = angular.element(element[0].querySelectorAll('.data-set')[0]);
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
          if(!scope.dataSet) {
            return;
          }
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
      template: '<div class="data-item "></div>',
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
          element.append('<span class="' + scope.schema[i].align + '-align ' + scope.schema[i].type + ' ' + i + ' ' + scope.schema[i].className + '" >' + trim(dataManager.getObjectDotNotation(scope.data, i), 64) + '</span>');
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
        var dataHolder = angular.element(element[0].querySelectorAll('.editor-data-holder')[0]);
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
            }, function() {
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

          scope.setupForm(data);
        });

        scope.setupForm = function(data) {
          dataHolder = angular.element(element[0].querySelectorAll('.editor-data-holder')[0]);
          scope.isDeleting = false;
          if(data && data._id) {
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
        };

        scope.setupForm(dataManager.getSelected());
      }
    }
  })
  .directive('editorType', function($parse, $http, $templateCache, $compile, dataManager, accountManager, $rootScope, $timeout) {
    return {
      scope: {data: '=ngModel', scheme: '=', schemeObject: '=', label: '@', type: '=editorType', id: '@', verb: '@'},
      restrict: 'A',
      link: function(scope, element, attrs) {
        var cmLoaded = false;
        scope.$watch('type', function(val) {
          if(val) {
            loadTpl(val);
          }
        });

        scope.datetimeOpened = false;
        scope.datetimeOpen = function(evt) {
          evt.preventDefault();
          evt.stopPropagation();

          scope.datetimeOpened = true;
        };

        scope.generateSlug = function() {
          var slug = slugify(scope.schemeObject[scope.scheme.slug]);
          slug = trim(slug, 64, ' ');
          scope.data = slug.toLowerCase();
        };

        scope.upload = [];

        scope.codeMirrorOutput = '';
        scope.codeMirrorPreview = false;
        scope.toggleCodeMirrorPreview = function() {
          scope.codeMirrorPreview = !scope.codeMirrorPreview;
        };
        scope.codeMirrorEditor = null;
        scope.codeMirrorOptions = {
          mode: 'gfm',
          tabMode: 'indent',
          tabindex: '4',
          cursorScrollMargin: 10,
          lineWrapping: true,
          dragDrop: true
        };

        function handleUploadSuccess(res) {
          console.log(res);
          scope.codeMirrorOptions.codemirror.replaceSelection('![Image Upload](' + res.data.pkg.data.url + ')');
          scope.codeMirrorOptions.codemirror.execCommand('newlineAndIndent');
        }

        function handleUploadError(res) {
          console.log(res);
          $rootScope.addRootAlert('error', 'An error occurred uploading the file: ' + (res.pkg ? res.pkg.statusMessage : 'Unknown error'));
        }

        function handleUploadProgress(evt) {
          console.log(evt);
        }

        scope.handleUpload = function(evt) {
          for(var i = 0; i < evt.dataTransfer.files.length; i++) {
            console.log(evt.dataTransfer.files[i]);
            accountManager.uploadAsset(evt.dataTransfer.files[i]).then(handleUploadSuccess, handleUploadError, handleUploadProgress);
          }
        };

        scope.$watch(function() { return Object.keys(scope.codeMirrorOptions).length; }, function() {
          if(!scope.codeMirrorOptions.codemirror) {
            return;
          }

          if(cmLoaded) {
            return;
          }

          cmLoaded = true;

          var cm = scope.codeMirrorOptions.codemirror;
          cm.on('change', function() {
            $timeout(function() {
              scope.data = cm.getValue();
              marked(cm.getValue(), function (err, content) {
                if (err) {
                  console.log(err);
                  return;
                }
                scope.codeMirrorOutput = content;
              });
            });
          });
          cm.on('dragstart', function(cm, evt) {
            element.addClass('dragging');
            evt.dataTransfer.dropEffect = 'copy';
          });
          cm.on('dragenter', function(cm, evt) {
            element.addClass('dragging');
            evt.dataTransfer.dropEffect = 'copy';
          });
          cm.on('dragleave', function(cm, evt) {
            element.removeClass('dragging');
            evt.dataTransfer.dropEffect = 'none';
          });
          cm.on('drop', function(cm, evt) {
            element.removeClass('dragging');
            evt.preventDefault();
            if(!confirm('Insert upload here?')) {
              return;
            }
            scope.handleUpload(evt);
          });
          if(scope.data) {
            cm.setValue(scope.data);
          }
        });

        scope.data = dataManager.getObjectDotNotation(scope.schemeObject, scope.id);

        function loadTpl(type) {
          $http.get('template/editor-data/' + type + '.html', {cache: $templateCache})
            .success(function(html) {
              element.html(html);
            }).then(function(response) {
              element = element.replaceWith($compile(response.data)(scope));
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

angular.module('{{appName}}').run(['$templateCache', function($templateCache) {
  $templateCache.put('template/editor-data/editor.html',
    '<div class="editor-data"><h3>{{verb}}</h3><div class="editor-actions"><a href class="save btn btn-primary" ng-click="saveData()"><span class="glyphicon glyphicon-save"></span> Save</a> <a href class="btn btn-default" ng-click="closeData()"><span class="glyphicon glyphicon-remove"></span></a></div><div class="editor-data-holder"></div><div class="delete-holder" ng-show="verb == \'Edit\'"><button class="delete btn btn-danger" ng-click="deleteConfirm()"><span ng-class="{active: isDeleting == false}">Delete</span><span ng-class="{active: isDeleting == true}">Click again to confirm</span></button> <button class="btn btn-default" ng-show="isDeleting == true" ng-click="cancelDelete()">Cancel</button></div></div>');
}]);

angular.module('{{appName}}').run(['$templateCache', function($templateCache) {
  $templateCache.put('template/editor-data/text.html',
    '<div class="form-group" ng-show="scheme.verbs.indexOf(verb) > -1"><label ng-bind="label"></label><input class="form-control" type="text" ng-model="data" ng-enter="saveData()"></div>');
}]);

angular.module('{{appName}}').run(['$templateCache', function($templateCache) {
  $templateCache.put('template/editor-data/textarea.html',
    '<div class="form-group" ng-show="scheme.verbs.indexOf(verb) > -1"><label ng-bind="label"></label><textarea class="form-control" ng-model="data"></textarea></div>');
}]);

angular.module('{{appName}}').run(['$templateCache', function($templateCache) {
  $templateCache.put('template/editor-data/email.html',
    '<div class="form-group" ng-show="scheme.verbs.indexOf(verb) > -1"><label ng-bind="label"></label><input class="form-control" type="email" ng-model="data" ng-enter="saveData()"></div>');
}]);

angular.module('{{appName}}').run(['$templateCache', function($templateCache) {
  $templateCache.put('template/editor-data/password.html',
    '<div class="form-group" ng-show="scheme.verbs.indexOf(verb) > -1"><label ng-bind="label"></label><input class="form-control" type="password" ng-model="data" ng-init="data = \'\'" ng-enter="saveData()"></div>');
}]);

angular.module('{{appName}}').run(['$templateCache', function($templateCache) {
  $templateCache.put('template/editor-data/currency.html',
    '<div class="form-group" ng-show="scheme.verbs.indexOf(verb) > -1"><label ng-bind="label"></label><input class="form-control" type="text" ng-model="data" ng-enter="saveData()"></div>');
}]);

angular.module('{{appName}}').run(['$templateCache', function($templateCache) {
  $templateCache.put('template/editor-data/toggle.html',
    '<div class="form-group" ng-show="scheme.verbs.indexOf(verb) > -1"><input type="checkbox" ng-model="data" id="{{id}}"><label for="{{id}}" ng-bind="label"></label></div>');
}]);

angular.module('{{appName}}').run(['$templateCache', function($templateCache) {
  $templateCache.put('template/editor-data/select.html',
    '<div class="form-group" ng-show="scheme.verbs.indexOf(verb) > -1"><label ng-bind="label"></label><select class="form-control" ng-model="data" ng-options="option.value as option.name for option in scheme.options"><option value>Select One</option></select></div>');
}]);

angular.module('{{appName}}').run(['$templateCache', function($templateCache) {
  $templateCache.put('template/editor-data/button.html',
    '<div class="form-group" ng-show="scheme.verbs.indexOf(verb) > -1"><button class="btn btn-default" ng-click="doCallback()">{{label}}</button></div>');
}]);

angular.module('{{appName}}').run(['$templateCache', function($templateCache) {
  $templateCache.put('template/editor-data/tag-cloud.html',
    '<div class="form-group" ng-show="scheme.verbs.indexOf(verb) > -1"><label ng-bind="label"></label><token-input type="text" ng-model="data" placeholder="Begin typing a tag" tag-cloud="{{scheme.tag_cloud}}"></token-input></div>');
}]);

angular.module('{{appName}}').run(['$templateCache', function($templateCache) {
  $templateCache.put('template/editor-data/datetime.html',
    '<div class="form-group" ng-show="scheme.verbs.indexOf(verb) > -1"><label ng-bind="label"></label><p class="input-group"><input type="text" class="form-control" datepicker-popup="MMMM dd yyyy" ng-model="data" is-open="datetimeOpened" close-text="Close" /> <span class="input-group-btn"><button type="button" class="btn btn-default" ng-click="datetimeOpen($event)"><i class="glyphicon glyphicon-calendar"></i></button></span></p><p><timepicker ng-model="data" hour-step="1" minute-step="1" show-meridian="true"></timepicker></p></div>');
}]);

angular.module('{{appName}}').run(['$templateCache', function($templateCache) {
  $templateCache.put('template/editor-data/markdown.html',
    '<div class="form-group codemirror" ng-show="scheme.verbs.indexOf(verb) > -1"><label>{{label}} <a href class="btn btn-xs btn-success" ng-click="toggleCodeMirrorPreview()" ng-bind="codeMirrorPreview ? \'Write\' : \'Preview\'"></a></label><div ng-show="codeMirrorPreview" ng-bind-html="codeMirrorOutput"></div><div ng-show="!codeMirrorPreview" ng-model="data" vern-codemirror="codeMirrorOptions"></div></div>');
}]);

angular.module('{{appName}}').run(['$templateCache', function($templateCache) {
  $templateCache.put('template/editor-data/images.html',
    '<div class="form-group image-upload" ng-show="scheme.verbs.indexOf(verb) > -1"><label>{{label}}</label><asset-upload options="scheme.options" ng-model="data"></asset-upload></div>')
}]);

angular.module('{{appName}}').run(['$templateCache', function($templateCache) {
  $templateCache.put('template/editor-data/slug.html',
    '<div class="form-group slug" ng-show="scheme.verbs.indexOf(verb) > -1"><label>{{label}} <a href class="btn btn-xs btn-success" ng-click="generateSlug()">Generate</a></label><input class="form-control" type="text" ng-model="data" ng-enter="saveData()"></div>')
}]);
