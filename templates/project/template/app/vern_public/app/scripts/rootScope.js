var app = angular.module('{{appName}}')
  .run(function($rootScope, vernConfig, localStorageService, $route, $routeParams, $location, accountManager, dataManager) {
    $rootScope.page_title = '';
    $rootScope.controller = '';
    $rootScope.event = null;
    $rootScope.userData = localStorageService.get(vernConfig.sessionName);
    $rootScope.redirect_path = null;
    $rootScope.date = new Date();

    $rootScope.rootAlerts = [];
    $rootScope.apiLoading = false;
    $rootScope.vernConfig = vernConfig;
    $rootScope.accountManager = accountManager;
    $rootScope.dataManager = dataManager;
    var authErrors = 0;

    $rootScope.$on(
      "$routeChangeSuccess",
      function( $currentRoute, $previousRoute ) {
        $rootScope.event = $route.current.event;
        if($route.current.page_title) {
          $rootScope.page_title = $route.current.page_title;
        } else {
          $rootScope.page_title = '';
        }
        var innerTemplateUrl = $route.current.innerTemplateUrl;

        if($routeParams.module && $route.current.section === 'main') {
          if($routeParams.action) {
            $rootScope.event = $routeParams.module + '.' + $routeParams.action;
            innerTemplateUrl = 'views/main/' + $routeParams.module + '/' + $routeParams.action + '.html';
          } else {
            $rootScope.event = $routeParams.module;
            innerTemplateUrl = 'views/main/' + $routeParams.module + '/index.html';
          }
        }

        if($routeParams.module && $route.current.section === 'account') {
          if($routeParams.action) {
            $rootScope.event = $routeParams.module + '.' + $routeParams.action;
            innerTemplateUrl = 'views/account/' + $routeParams.module + '/' + $routeParams.action + '.html';
          } else {
            $rootScope.event = $routeParams.module;
            innerTemplateUrl = 'views/account/' + $routeParams.module + '/index.html';
          }
        }

        if(innerTemplateUrl && innerTemplateUrl.length > 0) {
          $rootScope.innerTemplateUrl = innerTemplateUrl;
          $rootScope.innerController = $route.current.innerController;
        }

        vernConfig.language = $rootScope.userData && $rootScope.userData.lang ? $rootScope.userData.lang : vernConfig.defaultLanguage;
      }
    );

    $rootScope.$on('$routeChangeError', function(event, current, previous, error) {
      console.log(error);
      if(error.status === 404) {
        $location.path('/404');
      }
      if(error.status === 403) {
        $location.path('/403');
      }
    });

    $rootScope.$on('apiError', function(evt, msg, res, timeout) {
      if(res && res.responseCode === 403) {
        authErrors++;
        if(authErrors > 1) {
          authErrors = 0;
          $rootScope.userLogout('/');
        }
      }
      if(typeof msg === 'object') {
        $rootScope.addAlert('danger', msg.pkg.statusMessage, timeout);
      } else {
        $rootScope.addAlert('danger', msg, timeout);
      }
    });

    $rootScope.addAlert = $rootScope.addRootAlert = function(type, msg, timeout) {
      if(type === 'error') {
        type = 'danger';
      }
      if(!timeout) {
        timeout = 5000;
      }
      $rootScope.rootAlerts.push({type: type, content: msg});
      if(timeout > 0) {
        setTimeout(function () {
          $rootScope.rootAlerts.pop();
          $rootScope.$apply();
        }, timeout);
      }
    };

    $rootScope.closeAlert = $rootScope.closeRootAlert = function(index) {
      $rootScope.rootAlerts.splice(index, 1);
    };

    $rootScope.getConfig = function(v) {
      return $rootScope.vernConfig[v];
    };

    $rootScope.setConfig = function(t, v) {
      $rootScope.vernConfig[t] = v;
      return $rootScope.vernConfig[t];
    };
  });
