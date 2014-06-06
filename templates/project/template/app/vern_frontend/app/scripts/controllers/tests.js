'use strict';

angular.module('VernApp')
  .controller('TestsCtrl', function ($scope, apiRequest, ngDictionary, $rootScope, $location) {
    $scope.testData = {};
    $scope.lang = ngDictionary.home;

  });
