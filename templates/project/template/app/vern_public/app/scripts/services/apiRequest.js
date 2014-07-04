'use strict';

angular.module('{{appName}}')
  .factory('apiRequest', function ($rootScope, config, $http, $location, localStorageService) {
    var baseUrl = ($location.host() === '0.0.0.0' || $location.host() === 'localhost') ? config.devHost : config.productionHost;

    return {
      get: function (args) {
        var defaults = {
          method: 'GET',
          path: '',
          data: {},
          success: function(){},
          error: this.standardError,
          headers: {}
        };
        
        if($rootScope.userData) {
          defaults.headers['authentication-key'] = $rootScope.userData.authenticationKey;
        }
        
        var conf = angular.extend(defaults, args);
        
        var dataKeys = Object.keys(conf.data);
        if(dataKeys.length > 0) {
          conf.path += '?';
          for(var i in conf.data) {
            if(typeof conf.data[i] === 'object') {
              conf.path += i + '=' + JSON.stringify(conf.data[i]);
            } else {
              conf.path += i + '=' + conf.data[i];
            }
            if(i !== dataKeys[dataKeys.length-1]) {
              conf.path += '&';
            }
          }
        }
        
        $rootScope.apiLoading = true;
        $http({
          method: conf.method,
          url: baseUrl + conf.path,
          headers: conf.headers
        })
        .success(function(res) {
          $rootScope.apiLoading = false;
          conf.success(res);
        })
        .error(function(res) {
          $rootScope.apiLoading = false;
          conf.error(res)
        });
      },
      post: function(args) {
        var defaults = {
          method: 'POST',
          path: '',
          data: {},
          success: function(){},
          error: this.standardError,
          contentType: 'application/json',
          headers: {}
        };
        
        if($rootScope.userData) {
          defaults.headers['authentication-key'] = $rootScope.userData.authenticationKey;
        }
        
        var conf = angular.extend(defaults, args);
        
        $rootScope.apiLoading = true;
        $http({
          method: conf.method,
          url: baseUrl + conf.path,
          data: JSON.stringify(conf.data),
          headers: conf.headers
        })
        .success(function(res) {
          $rootScope.apiLoading = false;
          conf.success(res);
        })
        .error(function(res) {
          $rootScope.apiLoading = false;
          conf.error(res)
        });
      },
      put: function(args) {
        var defaults = {
          method: 'PUT',
          path: '',
          data: {},
          success: function(){},
          error: this.standardError,
          contentType: 'application/json',
          headers: {}
        };

        if($rootScope.userData) {
          defaults.headers['authentication-key'] = $rootScope.userData.authenticationKey;
        }

        var conf = angular.extend(defaults, args);

        $rootScope.apiLoading = true;
        $http({
          method: conf.method,
          url: baseUrl + conf.path,
          data: JSON.stringify(conf.data),
          headers: conf.headers
        })
          .success(function(res) {
            $rootScope.apiLoading = false;
            conf.success(res);
          })
          .error(function(res) {
            $rootScope.apiLoading = false;
            conf.error(res)
          });
      },
      postFormData: function(args) {
        var defaults = {
          method: 'POST',
          path: '',
          data: {},
          transform: true,
          success: function(){},
          error: this.standardError,
          headers: {
            'Content-Type': undefined
          }
        };
        
        if($rootScope.userData) {
          defaults.headers['authentication-key'] = $rootScope.userData.authenticationKey;
        }
        
        var conf = angular.extend(defaults, args);
        
        $rootScope.apiLoading = true;
        $http({
          method: conf.method,
          url: baseUrl + conf.path,
          data: conf.data,
          headers: conf.headers,
          transformRequest: function(data) {
            if(conf.transform === false) {
              return data;
            }
            var fd = new FormData();
            angular.forEach(data, function(value, key) {
              if(Object.prototype.toString.call(value) === '[object Array]') {
                // We have an array, break it up...
                for(var i = 0; i < value.length; i++) {
                  fd.append(key, value[i]);
                }
                return;
              }
              fd.append(key, value);
            });
            return fd;
          }
        })
        .success(function(res) {
          $rootScope.apiLoading = false;
          conf.success(res);
        })
        .error(function(res) {
          $rootScope.apiLoading = false;
          conf.error(res)
        });
      },
      del: function(args) {
        var defaults = {
          method: 'DELETE',
          path: '',
          data: {},
          success: function(){},
          error: this.standardError,
          headers: {}
        };
        
        if($rootScope.userData) {
          defaults.headers['authentication-key'] = $rootScope.userData.authenticationKey;
        }
        
        var conf = angular.extend(defaults, args);
        
        var dataKeys = Object.keys(conf.data);
        if(dataKeys.length > 0) {
          conf.path += '?';
          for(var i in conf.data) {
            conf.path += i + '=' + conf.data[i];
            if(i !== dataKeys[dataKeys.length-1]) {
              conf.path += '&';
            }
          }
        }
        
        $rootScope.apiLoading = true;
        $http({
          method: conf.method,
          url: baseUrl + conf.path,
          headers: conf.headers
        })
        .success(function(res) {
          $rootScope.apiLoading = false;
          conf.success(res);
        })
        .error(function(res) {
          $rootScope.apiLoading = false;
          conf.error(res)
        });
      },
      standardError: function(res, redirect) {
        if(res.pkg === undefined) {
          $rootScope.addRootAlert('danger', 'An error occurred connecting to the server');
          if(typeof redirect === 'string') {
            $location.path(redirect);
          }
          return;
        }
        $rootScope.addRootAlert('danger', res.pkg.statusMessage);
        if(res.pkg.responseCode === 403) {
          $rootScope.setUser(null);
          if(typeof redirect === 'string' && redirect.length > 0) {
            $location.path(redirect);
          } else {
            // need a default redirect, and add a variable to retain the last page you were on.
          }
        }

        if(typeof redirect === 'string' && redirect.length > 0) {
          $location.path(redirect);
        }
      }
    };
  });
