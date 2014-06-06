'use strict';

angular.module('VernApp')
  .controller('OAuthCtrl', function ($scope, apiRequest, localStorageService, $location, $rootScope, $routeParams) {
    $scope.oAuthData = {};
  });
