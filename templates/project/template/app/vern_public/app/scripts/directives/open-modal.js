'use strict';
angular.module('{{appName}}')
  .directive('openModal', function($modal, $parse, $rootScope) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        element.on('click', function(e) {
          if(scope.onload) {
            scope.onload(element, attr);
          }

          var bg = $rootScope.$eval(attr.modalBackdropEnabled);

          scope.modal = $modal.open({
            templateUrl: attr.openModal,
            controller: attr.modalController,
            backdrop: (bg !== undefined) ? bg : 'static',
            scope: scope,
            windowClass: attr.modalClass || 'animated',
            resolve: {
              id: function() {
                if(attr.id) {
                  return attr.id;
                } else {
                  return null;
                }
              },
              workingObject: function() {
                if(attr.object) {
                  return $parse(attr.object)(scope);
                } else {
                  return null;
                }
              }
            }
          });

        });
      }
    }
  });