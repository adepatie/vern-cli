'use strict';

angular.module('VernApp.filters', [])
  .filter('semanticDate', function() {
    return function(input, options) {
      var out = '';

      var now = new Date();
      var onedayago = new Date();
      onedayago.setDate(onedayago.getDate() - 1);
      var d = new Date(input);
      var today = now.getDate() + now.getMonth() + now.getFullYear();
      var yesterday = onedayago.getDate() + onedayago.getMonth() + onedayago.getFullYear();
      var compare_date = d.getDate() + d.getMonth() + d.getFullYear();

      var time = (d.getHours() > 11 ? (d.getHours() - 12) + ':' + (d.getMinutes() >= 10 ? d.getMinutes() : '0' + d.getMinutes()) + 'pm' : (d.getHours()) + ':' + (d.getMinutes() >= 10 ? d.getMinutes() : '0' + d.getMinutes()) + 'am');

      if(today === compare_date) {
        out = 'Today ' + time;
      } else {
        if(compare_date === yesterday) {
          out = 'Yesterday ' + time;
        } else {
          out = (d.getMonth() + 1) + '/' + (d.getDate()) + '/' + (d.getFullYear()) + ' ' + time;
        }
      }

      return out;
    }
  });