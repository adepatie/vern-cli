'use strict';

angular.module('{{adminAppName}}').config(function(vernConfigProvider) {
  vernConfigProvider.devHost = 'http://localhost:3458/';
  vernConfigProvider.productionHost = 'http://www.mywebsite.com/api/';
  vernConfigProvider.sessionName = 'vernAdminUser';
  vernConfigProvider.defaultLanguage = 'en';
  vernConfigProvider.language = vernConfigProvider.defaultLanguage;
});
