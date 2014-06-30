'use strict';

angular.module('{{appName}}')
  .controller('MenuCtrl', function ($scope, config, ngDictionary, $location, $rootScope) {
    $scope.lang = ngDictionary[config.language].header;
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
