'use strict';

angular.module('{{adminAppName}}')
  .controller('OAuthCtrl', function ($scope, apiRequest, localStorageService, $location, $rootScope, $routeParams) {
    $scope.oAuthData = {};
  });
