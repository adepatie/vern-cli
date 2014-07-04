'use strict';

angular.module('{{appName}}')
  .controller('UsersCtrl', function ($scope, dataManager, apiRequest, $rootScope) {
    $scope.users = [];
    dataManager.setAdmin(true);
    dataManager.setController('users');
    var scheme = {
      email: {name: 'Email', required: true, display: ['list', 'tile'], type: 'email'},
      username: {name: 'Username', required: true, type: 'text'},
      active: {name: 'Active', type: 'toggle'},
      __send_activation: {name: 'Send Activation Email', callback: sendActivation, type: 'button', verbs: ['Edit']},
      first_name: {name: 'First Name', required: true, display: ['list', 'tile'], type: 'text'},
      last_name: {name: 'Last Name', required: true, display: ['list', 'tile'], type: 'text'},
      password: {name: 'Password', type: 'password'},
      confirm_password: {name: 'Confirm Password', type: 'password'}
    };
    dataManager.setSchema(scheme);
    dataManager.pullData().then(function(users) {
      $scope.users = users;
    });

    function sendActivation(data) {
      console.log(data);
      var lparams = {
        id: data._id
      };

      apiRequest.post({
        path: 'admin/users/send-activation',
        data: lparams,
        success: function(res) {
          $rootScope.addAlert('success', 'Email was sent successfully');
        },
        error: function(res) {
          $rootScope.addAlert('danger', 'An error occurred');
        }
      });
    }
  });
