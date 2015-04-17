'use strict';

angular.module('{{adminAppName}}')
  .controller('MainCtrl', function ($scope, accountManager, ngDictionary, $rootScope, $location) {
    $scope.homeData = {};
    $scope.lang = ngDictionary.home;
    $scope.login = {
      username: '',
      password: ''
    };

    if(accountManager.ensureLogin()) {
      $location.path('/dashboard');
    } else if($location.path() !== '/') {
      $location.path('/');
    }


    $scope.loginUser = function() {
      accountManager.doSignIn($scope.login.username, $scope.login.password).then(function(account) {
        if(account.role !== 'admin') {
          $rootScope.addAlert('warning', 'You are not an administrator');
          return $location.path('/');
        }
        if($rootScope.redirect_path) {
          var redirect = $rootScope.redirect_path;
          $rootScope.redirect_path = null;
          return $location.path(redirect);
        }
        $location.path('/dashboard');
      }, function(err) {
        $scope.$emit('apiError', err);
      });
    };
  });
