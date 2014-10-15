'use strict';
angular.module('{{adminAppName}}')
  .directive('assetUpload', function($compile, accountManager, apiRequest, localStorageService, $rootScope, $timeout) {
    return {
      restrict: 'AE',
      templateUrl: 'views/directives/asset-upload.html',
      replace: false,
      scope: { fileUrl: '=ngModel', options: '=?' },
      controller: function($scope, $element, $attrs) {
        var uploader = null;
        var uploadContainer = null;
        var defaults = {
          multiple: false,
          limit: 1,
          outputWrapper: '{{url}}',
          image: false,
          cancelMethod: null
        };

        $scope.$watch('options', function() {
          $scope.options = angular.extend({}, defaults, $scope.options);
          if($scope.options.multiple === false) {
            $scope.options.limit = 1;
          }

          if(!$scope.fileUrl || !($scope.fileUrl instanceof Array)) {
            $scope.fileUrl = [];
          }

          if(typeof $scope.fileUrl === 'object') {
            for(var i = 0; i < $scope.fileUrl.length; i++) {
              $scope.fileUrl[i] = $scope.options.outputWrapper.replace('{{url}}', $scope.fileUrl[i]);
            }
          } else {
            $scope.fileUrl = [];
          }

          setTimeout(function() {
            uploader = angular.element($element[0].querySelector('.uploader'));
            uploadContainer = angular.element($element[0].querySelector('.uploadContainer'));

            uploader.bind('change', handleUploads);
          }, 1);
        }, true);

        $scope.$watch('fileUrl', function() {
          if(typeof $scope.fileUrl === 'string') {
            $scope.fileUrl = [$scope.fileUrl];
          }

          if(typeof $scope.fileUrl === 'object') {
            for(var i = 0; i < $scope.fileUrl.length; i++) {
              $scope.fileUrl[i] = $scope.options.outputWrapper.replace('{{url}}', $scope.fileUrl[i]);
            }
          } else {
            $scope.fileUrl = [];
          }
        });

        $scope.replaceIndex = null;

        $scope.sortableOptions = {
          cursor: 'move',
          items: '> div',
          tolerance: 'pointer'
        };

        $scope.fileList = accountManager.assetList;
        $scope.formWait = false;

        $scope.uploadFile = function() {
          $timeout(function() {
            if($scope.fileUrl.length >= $scope.options.limit-1) {
              $scope.replaceIndex = 0;
            }
            var event = new CustomEvent("click");

            uploader[0].dispatchEvent(event);
            //uploader.trigger('click');
          }, 0);
        };

        $scope.removeFile = function(index) {
          console.log(index);
          if(typeof index === 'undefined') {
            $scope.fileUrl = '';
          } else {
            $scope.fileUrl.splice(index, 1);
          }
        };

        $scope.replaceFile = function(index) {
          $scope.replaceIndex = index;
          console.log('Replacing ' + index);
          $scope.uploadFile();
        };

        function handleUploads() {
          var files = this.files;
          $scope.formWait = true;

          for(var i = 0; i < files.length; i++) {
            if($scope.fileUrl.length >= $scope.options.limit) {
              accountManager.uploadAsset(files[i], handleImageSuccess, handleImageError, i);
            } else {
              accountManager.uploadAsset(files[i], handleImageSuccess, handleImageError);
            }
          }
        }

        function replaceUploader() {
          $scope.replaceIndex = null;
          var newUploader = uploader.clone();
          newUploader.on('change', handleUploads);
          uploader.replaceWith(newUploader);
          uploader = newUploader;
        }

        function handleImageSuccess(res, original, replaceIndex) {
          $scope.formWait = false;
          var file = res;
          if(!$scope.fileUrl) {
            $scope.fileUrl = [];
          }
          if($scope.replaceIndex !== null) {
            $scope.fileUrl[$scope.replaceIndex] = $scope.options.outputWrapper.replace('{{url}}', file.url);
            $scope.replaceIndex = null;
          } else if(replaceIndex) {
            $scope.fileUrl[replaceIndex] = $scope.options.outputWrapper.replace('{{url}}', file.url);
          } else {
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