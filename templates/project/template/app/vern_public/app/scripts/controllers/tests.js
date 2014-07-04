'use strict';

angular.module('{{appName}}')
  .controller('TestsCtrl', function ($scope, apiRequest, ngDictionary, $rootScope, $location) {
    $scope.testData = {};
    $scope.lang = ngDictionary.home;

  });
