'use strict';
angular.module('{{appName}}')
  .directive('assetUpload', function($compile, accountManager, apiRequest, localStorageService, $rootScope) {
    return {
      restrict: 'AE',
      templateUrl: 'views/directives/asset-upload.html',
      replace: false,
      scope: { fileUrl: '=ngModel' },
      controller: function($scope, $element, $attrs) {
        var uploader = $element.find('.uploader');
        var uploadContainer = $element.find('.uploadContainer');
        
        var defaults = {
          multiple: false,
          limit: 1,
          outputWrapper: '{{url}}',
          image: false
        };
        
        $scope.options = $scope.$eval($attrs.options);
        $scope.options = angular.extend(defaults, $scope.options);
        
        if($scope.options.multiple === false) {
          $scope.fileUrl = $scope.fileUrl ? $scope.options.outputWrapper.replace('{{url}}', $scope.fileUrl) : null;
        } else {
          if(typeof $scope.fileUrl === 'object') {
            for(var i = 0; i < $scope.fileUrl.length; i++) {
              $scope.fileUrl[i] = $scope.options.outputWrapper.replace('{{url}}', $scope.fileUrl[i]);
            }
          } else {
            $scope.fileUrl = [];
          }
        }
        $scope.fileList = accountManager.assetList;
        $scope.formWait = false;
        
        $scope.uploadFile = function() {
          console.log(uploader);
          uploader.trigger('click');
        };
        
        $scope.removeFile = function(index) {
          if(typeof index === 'undefined') {
            var keyParts = $scope.fileUrl.split('/');
            var key = keyParts[keyParts.length - 1];
            accountManager.deleteAsset(key);
            $scope.fileUrl = null;
          } else {
            var file = $scope.fileUrl.splice(index, 1);
            var keyParts = file.split('/');
            var key = keyParts[keyParts.length - 1];
            accountManager.deleteAsset(key);
          }
        };
        
        function handleUploads() {
          var files = this.files;
          $scope.formWait = true;

          for(var i = 0; i < files.length; i++) {
            console.log('uploading');
            accountManager.uploadAsset(files[i], handleImageSuccess, handleImageError);
          }
        }
        
        function replaceUploader() {
          var newUploader = uploader.clone();
          newUploader.on('change', handleUploads);
          uploader.replaceWith(newUploader);
          uploader = newUploader;
        }
        
        function handleImageSuccess(res) {
          $scope.formWait = false;
          var file = res;
          if($scope.options.multiple === false) {
            $scope.fileUrl = $scope.options.outputWrapper.replace('{{url}}', file.url);
          } else {
            console.log($scope.fileUrl);
            $scope.fileUrl.push($scope.options.outputWrapper.replace('{{url}}', file.url));
          }
          replaceUploader();
        }
        
        function handleImageError(res) {
          $scope.formWait = false;
          $rootScope.addRootAlert('error', 
            'An error occurred uploading the file: ' + (res.pkg ? res.pkg.statusMessage : 'Unknown error'));
          replaceUploader();
        }
        
        uploader.on('change', handleUploads);
        
        $scope.refreshAssets = function() {
          accountManager.loadAssets();
        };
        
        $scope.$on('assetsLoaded', function(evt, data) {
          $scope.fileList = data;
        });
      },
      link: function(scope, element, attrs) {
        scope.refreshAssets();
      }
    }
  });