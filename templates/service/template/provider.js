'use strict';

angular.module('VernApp')
  .provider('{{service_name}}', function () {
    this.$get = function() {
      return {
        hello: function() {
          
        }
      };
    };
  });