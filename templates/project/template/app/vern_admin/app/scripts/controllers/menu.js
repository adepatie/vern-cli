'use strict';

angular.module('{{adminAppName}}')
  .controller('MenuCtrl', function ($scope, vernConfig, ngDictionary, $location, $rootScope) {
    $scope.lang = ngDictionary[vernConfig.language].header;
    $scope.menu = [];

    $scope.checkMenuActive = function(c) {
      if($location.path() === '/' && c === '/') {
        return 'active';
      } else if(c !== '/' && $location.path().indexOf(c) > -1) {
        return 'active';
      }

      return '';
    };
  });
