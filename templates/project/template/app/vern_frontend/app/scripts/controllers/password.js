'use strict';

angular.module('VernApp')
  .controller('PasswordCtrl', function ($scope, apiRequest, localStorageService, $location, $rootScope, $routeParams) {
    $scope.success = false;
    
    $scope.passwordData = {
      password_code: $routeParams.passwordCode,
      password: '',
      confirm_password: ''
    };
    
    $scope.submitPassword = function() {
      console.log($scope.passwordData);
      
      apiRequest.post({
        path: 'auth/reset-password',
        data: $scope.passwordData,
        success: function(res) {
          $rootScope.addRootAlert('success', 'Password reset successfully');
          $rootScope.setUser(res.pkg.data);
          $location.path('/account');
        }
      })
    };
  });
