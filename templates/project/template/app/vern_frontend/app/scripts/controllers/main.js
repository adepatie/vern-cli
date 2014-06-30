'use strict';

angular.module('{{appName}}')
  .controller('MainCtrl', function ($scope, apiRequest, ngDictionary, $rootScope, $location) {
    $scope.homeData = {};
    $scope.lang = ngDictionary.home;

  });
