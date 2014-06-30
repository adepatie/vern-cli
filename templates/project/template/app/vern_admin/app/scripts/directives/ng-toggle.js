'use strict';
angular.module('{{adminAppName}}')
  .directive('ngToggle', function($modal, $rootScope) {
    return {
      scope: {value: '=ngModel'},
      restrict: 'AE',
      template: '<div class="ngToggle">' +
                '  <div class="ngToggleHandle"></div>' +
                '</div>',
      link: function(scope, element, attrs) {
        scope.options = scope.$eval(attrs.options) || [
          {name: 'NO', value: false, selected: true},
          {name: 'YES', value: true, selected: false}
        ];
        scope.value = scope.value || false;
        
        element.addClass('ngToggleHolder');
        
        element.find('.ngToggle').on('click', function(evt) {
          var which = 0;
          if($rootScope.apiLoading) {
            return;
          }
          if(scope.value === scope.options[0].value) {
            scope.value = scope.options[1].value;
            which = 1;
          } else if(scope.value === scope.options[1].value) {
            scope.value = scope.options[0].value;
            which = 0;
          } else {
            scope.value = scope.options[1].value;
            which = 1;
          }
          
          if(which === 0) {
            element.find('> div').removeClass('active');
          } else {
            element.find('> div').addClass('active');
          }
          
          element.find('> div').attr('data-content', scope.options[which].name);
          scope.$apply();
        });
        
        var which = 0;
        if(scope.value === scope.options[0].value) {
          which = 0;
        } else if(scope.value === scope.options[1].value) {
          which = 1;
        } else {
          which = 0;
        }
        
        if(which === 0) {
          element.find('> div').removeClass('active');
        } else {
          element.find('> div').addClass('active');
        }
        
        element.find('> div').attr('data-content', scope.options[which].name);
      }
    }
  });