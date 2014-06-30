'use strict';

angular.module('{{adminAppName}}')
  .controller('AccountMainCtrl', function ($scope, apiRequest, ngDictionary, $rootScope, $location) {
    $scope.dashboard = {};
    $rootScope.ensureLogin('/');
  });
