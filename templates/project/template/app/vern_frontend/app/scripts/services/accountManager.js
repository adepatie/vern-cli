'use strict';

angular.module('VernApp')
  .factory('accountManager', function (apiRequest, localStorageService, $compile, $rootScope) {
    var $scope = this;

    $scope.assetList = [];
    
    $scope.loadAssets = function() {
      apiRequest.get({
        path: 'files/list',
        success: function(res) {
          $scope.assetList = res.pkg.data;
          $rootScope.$broadcast('assetsLoaded', $scope.assetList);
        }
      });
    };

    $scope.uploadAsset = function(file, success, error) {
      var fd = new FormData();
      fd.append('uploadedFile', file);

      apiRequest.postFormData({
        path: 'files/upload',
        data: fd,
        transform: false,
        success: function(res) {
          var newFile = res.pkg.data;
          success(newFile, file);
        },
        error: function(res) {
          error(res, file);
        }
      });
    };

    $scope.deleteAsset = function(file, callback) {
      var params = {
        fileName: typeof file === 'object' ? file.Key : file
      };

      apiRequest.del({
        path: 'files/upload',
        data: params,
        success: function(res) {
          if(callback) {
            callback(res, file);
          }
        }
      });
    };

    return $scope;
  });