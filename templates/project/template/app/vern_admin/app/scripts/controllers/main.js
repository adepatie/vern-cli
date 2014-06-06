'use strict';

angular.module('VernApp')
  .controller('MainCtrl', function ($scope, apiRequest, ngDictionary, $rootScope, $location) {
    $scope.homeData = {};
    $scope.lang = ngDictionary.home;
    $scope.login = {
      username: '',
      password: ''
    };

    if($rootScope.ensureLogin()) {
      $location.path('/dashboard');
    }

    $scope.loginUser = function() {
      apiRequest.post({
        path: 'auth/login',
        data: {username: $scope.login.username, password: $scope.login.password},
        success: function(res) {
          if(res.pkg.data.role !== 'admin') {
            $rootScope.addAlert('warning', 'You are not an administrator');
            return $location.path('/');
          }
          $rootScope.setUser(res.pkg.data);
          if($rootScope.redirect_path) {
            var redirect = $rootScope.redirect_path;
            $rootScope.redirect_path = null;
            return $location.path(redirect);
          }
          $location.path('/dashboard');
        }
      });
    };
  });
