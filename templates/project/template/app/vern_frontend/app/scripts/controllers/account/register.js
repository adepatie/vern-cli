'use strict';

angular.module('VernApp')
  .controller('RegisterCtrl', function($scope, apiRequest, $rootScope, $location, $modalInstance) {
    $scope.registerData = {
      email: null
    };
    $scope.loginData = {
      username: null,
      password: null
    };
    $scope.register = true;

    $scope.leftAmount = 0;
    $scope.step = 1;

    $scope.setStepHolderPosition = function() {
      return {
        left: $scope.leftAmount
      }
    };

    $scope.stepActive = function(s) {
      if($scope.step === s) {
        return 'active';
      }

      return '';
    };

    $scope.gotoStep = function(s) {
      $scope.step = s;
      var s = $scope.step-1;
      $scope.leftAmount = -(s * 558);
    };

    $scope.registerAccount = function() {
      apiRequest.post({
        path: 'auth/pre-register',
        data: {email: $scope.registerData.email},
        success: function(res) {
          $scope.gotoStep(3);
        }
      });
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