'use strict';

angular.module('VernApp')
  .controller('AccountMainCtrl', function ($scope, apiRequest, ngDictionary, $rootScope, $location) {
    $scope.dashboard = {};
    $rootScope.ensureLogin('/');
  });
