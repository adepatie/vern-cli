'use strict';

angular.module('{{appName}}')
  .controller('LoginCtrl', function($scope, accountManager, $location, $rootScope) {
    $scope.loginData = {
      username: null,
      password: null
    };
    $scope.passwordData = {
      email: null
    };
    $scope.forgot = false;

    $scope.loginAccount = function() {
      accountManager.doSignIn($scope.loginData.username, $scope.loginData.password).then(function(account) {
        $location.path('/account');
      }, function(err) {
        $scope.$emit('apiError', err);
      });
    };

    $scope.getPasswordCode = function() {
      accountManager.doForgotPassword($scope.passwordData.email).then(function(res) {
        $rootScope.addAlert('success', 'Password reset instructions sent to your email');
      }, function(err) {
        $scope.$emit('apiError', err);
      });
    };
  });
