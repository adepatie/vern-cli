'use strict';

angular.module('{{appName}}')
  .factory('dataManager', function(apiRequest, localStorageService, $rootScope, $q) {
    var $scope = this;
    var controller = '';
    var admin = false;
    var search = [];
    var conditions = {};
    var sort = 'update_time';
    var sortDir = -1;
    var data = [];
    var filters = {
      limit: 10,
      page: 1,
      sort: 'asc'
    };
    var schema = {};
    var baseSchemaOptions = {
      name: 'Field Name',
      required: false,
      display: null,
      type: 'text',
      callback: function(data) {},
      options: [],
      verbs: ['Add', 'Edit'],
      align: 'left',
      className: ''
    };
    var selected = null;

    $scope.currentData = [];

    $rootScope.$on('$routeChangeStart', function(evt) {
      $scope.currentData = [];
      controller = '';
      search = [];
      conditions = {};
      data = [];
      schema = {};
    });

    $scope.getObjectDotNotation = function(obj, dots) {
      if(!obj || typeof obj !== 'object') {
        return obj;
      }
      var levels = dots.split('.');
      return levels.reduce(function(obj, p) {
        return obj[p];
      }, obj);
    };

    $scope.setObjectDotNotation = function(obj, dots, val) {
      if(!obj || typeof obj !== 'object') {
        return obj;
      }
      var levels = dots.split('.');
      return levels.reduce(function(obj, p) {
        if(p === levels[levels.length-1]) {
          obj[p] = val;
        }
        return obj[p];
      }, obj);
    };

    $scope.setSelected = function(s) {
      selected = s;
    };
    $scope.getSelected = function() {
      return selected;
    };
    $scope.saveData = function(data) {
      var cleanData = angular.copy(data);
      var path = ((admin === true) ? 'admin/' : '') + controller;
      var defer = $q.defer();
      if(data._id) {
        apiRequest.put({
          path: path + '/' + data._id,
          data: cleanData,
          success: function(res) {
            var newData = res.pkg.data;
            $rootScope.$broadcast('dataRefresh', newData);
            defer.resolve(newData);
          },
          error: function(res) {
            apiRequest.standardError(res);
            defer.reject(res);
          }
        });
      } else {
        apiRequest.post({
          path: path,
          data: cleanData,
          success: function(res) {
            var newData = res.pkg.data;
            $rootScope.$broadcast('dataRefresh', newData);
            defer.resolve(newData);
          },
          error: function(res) {
            apiRequest.standardError(res);
            defer.reject(res);
          }
        });
      }

      return defer.promise;
    };
    $scope.deleteData = function(data) {
      var defer = $q.defer();
      var path = ((admin === true) ? 'admin/' : '') + controller;
      apiRequest.del({
        path: path,
        data: data,
        success: function(res) {
          defer.resolve(res);
          $rootScope.$broadcast('dataDelete', data._id);
        },
        error: function(res) {
          apiRequest.standardError(res);
          defer.reject(res);
        }
      });
      return defer.promise;
    };

    $scope.setController = function(c) {
      controller = c;
      return $scope;
    };
    $scope.getController = function() {
      return controller;
    };

    $scope.setSchema = function(s) {
      for(var i in s) {
        schema[i] = angular.extend({}, baseSchemaOptions, s[i]);
        if(!schema[i].variable) {
          schema[i].variable = i;
        }
      }
      return $scope;
    };
    $scope.getSchema = function() {
      return schema;
    };

    $scope.setAdmin = function(a) {
      admin = a;
      return $scope;
    };
    $scope.getAdmin = function() {
      return admin;
    };

    $scope.setSort = function(s, dir) {
      sort = s;
      sortDir = dir;
      return $scope;
    };
    $scope.getSort = function() {
      return {
        sort: sort,
        sortDir: sortDir
      };
    };

    $scope.setSearch = function(words) {
      search = words;
      return $scope;
    };
    $scope.getSearch = function() {
      return search;
    };

    $scope.setCondition = function(attr, value) {
      conditions[attr] = value;
      return $scope;
    };
    $scope.getCondition = function(attr) {
      return conditions[attr];
    };
    $scope.removeCondition = function(attr) {
      delete conditions[attr];
      return $scope;
    };

    $scope.setLimit = function(l) {
      filters.limit = l;
      return $scope;
    };
    $scope.getLimit = function() {
      return filters.limit;
    };

    $scope.setPage = function(p) {
      filters.page = p;
      return $scope;
    };
    $scope.getPage = function() {
      return filters.page;
    };

    // Useful for when populating filterable data from an outside source (ie: Google Feed or API source)
    $scope.getData = function() {
      return data;
    };

    $scope.setData = function(d) {
      data = d;
      return $scope;
    };

    // Get 'type' objects from the database
    $scope.pullData = function() {
      var deferred = $q.defer();
      data = [];
      var params = {
        conditions: {},
        limit: filters.limit,
        skip: filters.limit * (filters.page - 1)
      };

      if(search.length > 0) {
        params.search = {
          title: search.join('|'),
          description: search.join('|'),
          name: search.join('|'),
          display_name: search.join('|'),
          tags: search.join('|')
        };
        params.searchOptions = 'gi';

      }

      for(var i in conditions) {
        params.conditions[i] = conditions[i];
      }

      params.sort = sort;
      params.sortDir = sortDir;
      var path = ((admin === true) ? 'admin/' : '') + controller;
      apiRequest.get({
        path: path,
        data: params,
        success: function(res) {
          $scope.setData(res.pkg.data);
          deferred.resolve($scope.getData());
        },
        error: function(res) {
          apiRequest.standardError(res);
          deferred.reject(res);
        }
      });
      return deferred.promise;
    };

    return $scope;
  });