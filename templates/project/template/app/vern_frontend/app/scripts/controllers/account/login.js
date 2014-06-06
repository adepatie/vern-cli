'use strict';

angular.module('VernApp')
  .controller('LoginCtrl', function($scope, apiRequest, $rootScope, $modalInstance) {
    $scope.loginData = {
      username: null,
      password: null
    };

    $scope.loginAccount = function() {
      apiRequest.post({
        path: 'auth/login',
        data: {username: $scope.loginData.username, password: $scope.loginData.password},
        success: function(res) {
          $rootScope.setUser(res.pkg.data);
          if($rootScope.redirect_path) {
            var redirect = $rootScope.redirect_path;
            $rootScope.redirect_path = null;
            $modalInstance.close();
            return $location.path(redirect);
          }
          $modalInstance.close();
        },
        error: function(res) {
          console.log(res);
          if(!res || res.pkg === undefined) {
            $rootScope.addRootAlert('error', 'An error occurred connecting to the server');
            return;
          }
          $rootScope.addRootAlert('error', res.pkg.statusMessage);
          $rootScope.setUser(null);
        }
      });
    };
  });