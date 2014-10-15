'use strict';

angular.module('{{adminAppName}}')
  .factory('apiRequest', function ($rootScope, config, $http, $location, localStorageService) {
    var baseUrl = ($location.host() === '0.0.0.0' || $location.host() === 'localhost') ? config.devHost : config.productionHost;

    var errorCount = 0;

    return {
      currentStore: localStorageService.get(config.groupStorageName),
      cleanData: function(data) {
        if(!data) {
          return data;
        }
        var newData = angular.copy(data);
        if(typeof newData !== 'object') {
          return newData;
        }
        for(var i in newData) {
          if(i.charAt(0) === '$'
            && i !== '$or'
            && i !== '$not'
            && i !== '$ne'
            && i !== '$and'
            && i !== '$gt'
            && i !== '$gte'
            && i !== '$lt'
            && i !== '$gte'
            && i !== '$in'
            && i !== '$nin'
            && i !== '$exists'
            && i !== '$type'
            && i !== '$mod'
            && i !== '$regex'
            && i !== '$text'
            && i !== '$where'
            && i !== '$geoIntersects'
            && i !== '$geoWithin'
            && i !== '$nearSphere'
            && i !== '$near'
            && i !== '$box'
            && i !== '$centerSphere'
            && i !== '$center'
            && i !== '$geometry'
            && i !== '$maxDistance'
            && i !== '$minDistance'
            && i !== '$polygon'
            && i !== '$uniqueDocs'
            && i !== '$all'
            && i !== '$elemMatch'
            && i !== '$size'
            && i !== '$meta'
            && i !== '$slice') {
            console.log('deleting ' + i);
            delete newData[i];
          }
          if(typeof newData[i] === 'object') {
            newData[i] = this.cleanData(newData[i]);
          }
        }

        return newData;
      },
      get: function (args) {
        var defaults = {
          method: 'GET',
          path: '',
          data: {},
          success: function(){},
          error: this.standardError,
          noGroup: false,
          headers: {}
        };

        if($rootScope.userData) {
          defaults.headers['authentication-key'] = $rootScope.userData.authenticationKey;
        }

        var conf = angular.extend(defaults, args);
        if(this.currentStore && conf.noGroup === false) {
          if(!conf.data.conditions) {
            conf.data.conditions = {};
          }
          conf.data.conditions._groups = this.currentStore._id;
        }

        var dataKeys = Object.keys(conf.data);
        if(dataKeys.length > 0) {
          if(conf.path.indexOf('?') > -1) {
            conf.path += '&';
          } else {
            conf.path += '?';
          }
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

        conf.data = this.cleanData(conf.data);

        return $http({
          method: conf.method,
          url: baseUrl + conf.path,
          //params: conf.data,
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
          noGroup: false,
          headers: {}
        };

        if($rootScope.userData) {
          defaults.headers['authentication-key'] = $rootScope.userData.authenticationKey;
        }

        var conf = angular.extend(defaults, args);

        if(this.currentStore && conf.noGroup === false) {
          conf.data['_groups'] = this.currentStore._id;
          // need this for any oddball POST that act as GETs
          if(!conf.data.conditions) {
            conf.data.conditions = {};
          }
          conf.data.conditions._groups = this.currentStore._id;
        }

        $rootScope.apiLoading = true;

        conf.data = this.cleanData(conf.data);

        return $http({
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
          noGroup: false,
          headers: {}
        };

        if($rootScope.userData) {
          defaults.headers['authentication-key'] = $rootScope.userData.authenticationKey;
        }

        var conf = angular.extend(defaults, args);

        if(this.currentStore && conf.noGroup === false) {
          conf.data['_groups'] = this.currentStore._id;
        }

        $rootScope.apiLoading = true;

        conf.data = this.cleanData(conf.data);

        return $http({
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
          noGroup: false,
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

        if(this.currentStore && conf.noGroup === false) {
          conf.data['_groups'] = this.currentStore._id;
          // need this for any oddball POST that act as GETs
          if(!conf.data.conditions) {
            conf.data.conditions = {};
          }
          conf.data.conditions._groups = this.currentStore._id;
        }

        $rootScope.apiLoading = true;

        return $http({
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
              if(value instanceof Array) {
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
          noGroup: false,
          success: function(){},
          error: this.standardError,
          headers: {}
        };

        if($rootScope.userData) {
          defaults.headers['authentication-key'] = $rootScope.userData.authenticationKey;
        }

        var conf = angular.extend(defaults, args);

        if(this.currentStore && conf.noGroup === false) {
          conf.data['_groups'] = this.currentStore._id;
        }

        console.log(conf.data);

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
        return $http({
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
        errorCount++;
        if(errorCount > 2) {
          return;
        }
        setTimeout(function() {
          errorCount = 0;
        }, 5000);
        if(res.pkg === undefined) {
          $rootScope.addRootAlert('danger', 'An error occurred connecting to the server');
          if(typeof redirect === 'string') {
            $location.path(redirect);
          }
          return;
        }
        $rootScope.addRootAlert('danger', res.pkg.statusMessage);
        if(res.pkg.responseCode === 403) {
          if(res.pkg.statusMessage.indexOf('Authorization Required') > -1) {
            return $rootScope.userLogout(redirect);
          }
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
