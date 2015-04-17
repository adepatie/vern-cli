'use strict';

angular.module('{{appName}}')
  .controller('RegisterCtrl', function($scope, $rootScope, accountManager, $location) {
    $scope.registerData = {
      email: null
    };
    $scope.registered = false;

    $scope.registerAccount = function() {
      accountManager.doPreRegister($scope.registerData.email).then(function(account) {
        $rootScope.addAlert('success', 'User pre-registered. See admin panel to activate.');
        $scope.registered = true;
      }, function(err) {
        $scope.$emit('apiError', err);
      });
    };
  });
