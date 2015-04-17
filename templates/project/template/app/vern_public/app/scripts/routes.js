'use strict';

angular.module('{{appName}}').config(function(vernConfigProvider) {
  vernConfigProvider.routes = {
    public: [
      {
        path: '/',
        templateUrl: 'templates/main.html',
        innerTemplateUrl: 'views/main/index.html',
        controller: 'MainCtrl',
        event: 'home'
      }
    ],
    publicRestricted: [
      // For User restricted sections
      {
        path: '/account',
        templateUrl: 'templates/account.html',
        innerTemplateUrl: 'views/account/index.html',
        controller: 'AccountMainCtrl',
        event: 'account.home'
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
