'use strict';

angular.module('{{appName}}').config(function(vernConfigProvider) {
  vernConfigProvider.devHost = 'http://localhost:3458/';
  vernConfigProvider.productionHost = 'http://www.mywebsite.com/api/';
  vernConfigProvider.sessionName = 'vernUser';
  vernConfigProvider.defaultLanguage = 'en';
  vernConfigProvider.language = vernConfigProvider.defaultLanguage;

  /*

  Configure additional routes here

  vernConfigProvider.routes.public.push(
    {
      path: '/blog/:slug',
      templateUrl: 'templates/main.html',
      innerTemplateUrl: 'views/main/blog/view.html',
      event: 'blog.view',
      section: 'main'
    }
  );
  */
});
