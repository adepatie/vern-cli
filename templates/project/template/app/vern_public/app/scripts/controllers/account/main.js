'use strict';

angular.module('{{appName}}')
  .controller('AccountMainCtrl', function ($scope, apiRequest, ngDictionary, $rootScope, $location) {
    $scope.dashboard = {};
    $rootScope.ensureLogin('/');
  });
