'use strict';

angular.module('{{appName}}')
  .controller('TestsCtrl', function ($scope, apiRequest, ngDictionary, dataManager) {
    $scope.testData = [];
    $scope.lang = ngDictionary.home;

    dataManager.setController('index');
    dataManager.pullData().then(function(data) {
      $scope.testData = data;
    });
  });
