'use strict';

angular.module('VernApp', ['ngSanitize', 'ngRoute', 'ngTouch', 'config', 'LocalStorageModule', 'ui.bootstrap', 'ui.sortable', 'VernApp.filters', 'ngDictionary'])
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }])
  .config(function ($routeProvider, $locationProvider, config, $httpProvider) {
    for(var j in config.routes) {
      for(var i = 0; i < config.routes[j].length; i++) {
        var r = config.routes[j][i];
        $routeProvider.when(r.path, {
          templateUrl: r.templateUrl,
          innerTemplateUrl: r.innerTemplateUrl,
          controller: r.controller,
          event: r.event,
          section: r.section,
          page_title: r.page_title
        });
      }
    }
    $routeProvider.otherwise({
      redirectTo: '/'
    });
    $httpProvider.interceptors.push(function($q) {
      return {
        'requestError': function(rejection) {
          return $q.reject(rejection);
        },
        'responseError': function(rejection) {
          // may want to do something here to handle bad views
          return $q.reject(rejection);
        }
      }
    });
    $locationProvider.hashPrefix('!');
  });
