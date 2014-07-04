'use strict';

angular.module('{{appName}}')
  .controller('OAuthCtrl', function ($scope, apiRequest, localStorageService, $location, $rootScope, $routeParams) {
    $scope.oAuthData = {};
  });
