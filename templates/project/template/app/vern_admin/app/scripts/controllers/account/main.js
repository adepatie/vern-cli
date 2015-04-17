'use strict';

angular.module('{{adminAppName}}')
  .controller('AccountMainCtrl', function ($scope, accountManager) {
    $scope.dashboard = {};
    accountManager.ensureLogin('/')
  });
