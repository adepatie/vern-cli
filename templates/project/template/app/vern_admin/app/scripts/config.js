'use strict';

angular.module('{{adminAppName}}').config(function(vernConfigProvider) {
  vernConfigProvider.devHost = 'http://localhost:3458/';
  vernConfigProvider.productionHost = 'http://www.mywebsite.com/api/';
  vernConfigProvider.sessionName = 'vernAdminUser';
  vernConfigProvider.defaultLanguage = 'en';
  vernConfigProvider.language = vernConfigProvider.defaultLanguage;

  vernConfigProvider.routes.publicRestricted= [
    // For User account (public) sections
    {
      path: '/dashboard',
      templateUrl: 'templates/account.html',
      innerTemplateUrl:'views/main/account/index.html',
      controller: 'AccountMainCtrl',
      event: 'account.main'
    }
  ];

  vernConfigProvider.routes.default= [
    {
      path: '/:module',
      templateUrl: 'templates/account.html',
      innerTemplateUrl:'views/main/account/index.html',
      controller: 'AccountMainCtrl'
    },
    {
      path: '/:module/:action',
      templateUrl: 'templates/account.html',
      innerTemplateUrl:'views/main/account/index.html',
      controller: 'AccountMainCtrl'
    },
    {
      path: '/404',
      templateUrl: 'templates/error.html',
      innerTemplateUrl: 'views/errors/404.html'
    },
    {
      path: '/403',
      templateUrl: 'templates/error.html',
      innerTemplateUrl: 'views/errors/403.html'
    }
  ];

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
