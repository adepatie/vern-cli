'use strict';

angular.module('{{appName}}').config(function(vernConfigProvider) {
  vernConfigProvider.devHost = 'http://localhost:3458/';
  vernConfigProvider.productionHost = 'http://www.mywebsite.com/api/';
  vernConfigProvider.sessionName = 'vernUser';
  vernConfigProvider.defaultLanguage = 'en';
  vernConfigProvider.language = vernConfigProvider.defaultLanguage;
});
