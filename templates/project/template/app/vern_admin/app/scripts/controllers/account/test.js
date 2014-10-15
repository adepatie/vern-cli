'use strict';

angular.module('{{adminAppName}}')
  .controller('TestsCtrl', function ($scope, dataManager) {
    $scope.tests = [];
    dataManager.setAdmin(true);
    dataManager.setController('index');
    var scheme = {
      name: {name: 'Name', required: true, display: ['list', 'tile'], type: 'text'},
      tags: {name: 'Tags', display: ['list'], type: 'tag-cloud', tag_cloud: 'tags', default: []},
      post: {name: 'Post', type: 'markdown'}
    };
    dataManager.setSchema(scheme);
    dataManager.pullData().then(function(tests) {
      $scope.tests = tests;
    });
  });
