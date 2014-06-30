var app = angular.module('{{adminAppName}}')
  .run(function($rootScope, config, localStorageService, $route, $routeParams, $location, accountManager, dataManager) {
    $rootScope.page_title = '';
    $rootScope.controller = '';
    $rootScope.event = null;
    $rootScope.userData = localStorageService.get(config.sessionName);
    $rootScope.redirect_path = null;

    $rootScope.rootAlerts = [];
    $rootScope.apiLoading = false;
    $rootScope.config = config;
    $rootScope.accountManager = accountManager;
    $rootScope.dataManager = dataManager;

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

        if($routeParams.module) {
          if($routeParams.action) {
            $rootScope.event = $routeParams.module + '.' + $routeParams.action;
            innerTemplateUrl = 'views/main/account/' + $routeParams.module + '/' + $routeParams.action + '.html';
          } else {
            $rootScope.event = $routeParams.module;
            innerTemplateUrl = 'views/main/account/' + $routeParams.module + '/index.html';
          }
        }

        if(innerTemplateUrl && innerTemplateUrl.length > 0) {
          $rootScope.innerTemplateUrl = innerTemplateUrl;
          $rootScope.innerController = $route.current.innerController;
        }

        config.language = $rootScope.userData && $rootScope.userData.lang ? $rootScope.userData.lang : config.defaultLanguage;
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

    $rootScope.addAlert = $rootScope.addRootAlert = function(type, msg) {
      if(type === 'error') {
        type = 'danger';
      }
      $rootScope.rootAlerts.push({type: type, content: msg});
      setTimeout(function() {
        $rootScope.rootAlerts.pop();
        $rootScope.$apply();
      }, 5000);
      // Could add in timeout here for removing notifications.
    };

    $rootScope.closeAlert = $rootScope.closeRootAlert = function(index) {
      $rootScope.rootAlerts.splice(index, 1);
    };

    $rootScope.ensureLogin = function(redirect) {
      if($rootScope.userData === null) {
        if(redirect) {
          $location.path(redirect);
        }
        return false;
      }

      return true;
    };

    $rootScope.userLogout = function(redirect) {
      $rootScope.setUser(null);
      if(redirect) {
        return $location.path(redirect);
      }
      $location.path('/');
    };

    $rootScope.setUser = function(data) {
      $rootScope.userData = data;
      localStorageService.add(config.sessionName, JSON.stringify(data));
    };

    $rootScope.getConfig = function(v) {
      return $rootScope.config[v];
    };

    $rootScope.setConfig = function(t, v) {
      $rootScope.config[t] = v;
      return $rootScope.config[t];
    };
  });