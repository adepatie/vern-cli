'use strict';

angular.module('VernApp')
  .controller('MainCtrl', function ($scope, apiRequest, ngDictionary, $rootScope, $location) {
    $scope.homeData = {};
    $scope.lang = ngDictionary.home;

  });
