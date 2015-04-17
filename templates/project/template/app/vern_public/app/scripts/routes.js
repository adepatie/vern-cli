'use strict';

angular.module('{{appName}}').config(function(vernConfigProvider) {
  vernConfigProvider.routes = {
    public: [
      {
        path: '/',
        templateUrl: 'views/main/index.html',
        controller: 'MainCtrl',
        event: 'enterprise'
      }
    ],
    publicRestricted: [
      // For User restricted sections
      {
        path: '/account',
        templateUrl: 'views/account/main.html',
        innerTemplate: 'views/account/index.html',
        controller: 'AccountMainCtrl',
        event: 'account.index'
      }
    ],
    misc: [
      // For 3rd party connections
      {
        path: '/oauth/:options*',
        templateUrl: 'views/oauth.html',
        controller: 'OAuthCtrl'
      }
    ]
  };
});
