'use strict';

angular.module('{{adminAppName}}').config(function(vernConfigProvider) {
  vernConfigProvider.routes.publicRestricted = [
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
    }
  ];

  /*

   Configure additional routes here

   vernConfigProvider.routes.publicRestricted.push(
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
