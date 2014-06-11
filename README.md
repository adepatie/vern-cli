#Copyright Notice

VERN is copyright 2014 uh-sem-blee, Co. Built by typefoo.

#License

You may not use, alter, or redistribute this code without permission from uh-sem-blee, Co.

# VERN Command Line Interface (CLI)

Vern module and project management


## Install

You can easily install VERN-core and VERN-CLI with the Node Package Manager. If you have never used NodeJS or NPM then take a moment to install NodeJS (NPM is included) and also check some great resources for getting started with node such as:

 [NodeSchool.io](http://nodeschool.io/)  - An interactive NodeJS learning tool that is run through the command line

 [Node.js for Beginners](http://code.tutsplus.com/tutorials/node-js-for-beginners--net-26314) - A great getting started guide for NodeJS

 [Felix's NodeJS Guide](http://nodeguide.com/) - A comprehensive NodeJS guide written by Felix Geisendörfer

After you're feeling a bit more confident with both using NodeJS's asynchronous javascript and installing Node modules you can then move on to install the VERN-core itself.

For the library

`npm install vern-core`

For the CLI tool

`npm install -g vern-cli`


## Getting Started

VERN CLI is a command line tool designed to make building VERN applications much faster and easier

You can call any VERN-CLI commands by prefixing them with `vern`



### Create a Project

To create you very first VERN project simply type this into your command line with the path name (project name) of your choice

`vern create project <path>`
*the path can also be `.` for creating a project in the current directory*

This will take you through a simple process that allows you to install all the dependencies as well. You may choose to do this later, though the CLI tool will check if dependencies have been installed before starting the servers.

From this point you can `cd <pathname>` and start constructing the rest of your project.

You will notice that VERN-CLI has built an entire project directory structure for you as well as some default scripts.

//////////
#*IMAGE*

If you journey into your `apps` folder you will notice four vern folders that make up the primary structure of your project.

In `vern` is the back-end server component of your application. This is where the NodeJS server logic happens as well as the database models and controllers that define attributes and routes of all of the data in your application.

In `vern_admin` is the frontend admin portal for your site and the access point in which site administrators can manage data on the site.

In `vern-assets` is

In `vern_frontend` is the entire front user-end of your site where your views, scripts, and styles are. VERN frontend is mainly written in AngularJS. AngularJS is HTML with behaviors and allows you to create reusable javascript tags as well and allows the views to function as controllers. So, just like with NodeJS, if you've never used it before then it's time to take a break from vern and check out some of these resources.  We will get into a little more detail later but if you've never used this stuff then it's time to start practicing:

 [AngularJS](https://angularjs.org/) - Google's own Getting Started Guide and Documentation

 [Egghead.io](https://egghead.io/) - Some incredible AngularJS tutorial videos

 [AngularJS-Learning](https://github.com/jmcunningham/AngularJS-Learning) - A GitHub Repository full of great Angular learning resources


### Create a Route

Routes are the main components of the front-end of your site. They are the main views, which are tied together by the styles and the front-end javascript which manages data being passed to the view (such as names, paragraphs, and pictures).

`vern create route <admin|frontend> <name>`

This command will generate an HTMl file, a LESS style sheet, and an AngularJS controller. Use the `admin` option to add the view to the admin portal of your project. Otherwise just enter `frontend` as your parameter.

The first thing to do is to set up your view. Good ole' HTML:

    <div class="blog">
      <div class="blog-header">
        <div class="image-holder">
          <img src="" />
        </div>
        <h2 class="title"></h2>
        <div class="author"></div>
        <div class="timestamp"></div>
      </div>
      <div class="blog-content"></div>
    </div>

Now that the DOM is set up, it's time to add some data. We don't have any data set up on the server-side yet so for now we are going to add placeholder data to the controller.


 If you are just getting started and just want to design an easily expandable front-end website then this is your first step. We will go into greater detail about routes later. However, if you wish to take advantage of VERN's true capabilities then we recommend moving on to the next step...


### Create a Model

Models are object classes that define the structure of your data.

`vern create model <name>` - Should allow you to configure some stuff

Models are pretty straight-forward and involve simply defining the objects that you are going to have in your project. For example, if you want to create a blogging application and require a blog model it would go something like this :

    var validator = require('validator');

    function Model(scope) {
      function BlogModel() {
        this.author = null;
        this.created_at = null;
        this.title = null;
        this.thumbnail = null;
        this.text_content = null;

        return this.update(arguments[0]);
      }

      new scope.model().extend(BlogModel, {
        collection: 'blog',
        indexes: [],
        exclude: [],
        validations: {},
        validation_exceptions: {},
        non_editable: []
      }, null);

      return BlogModel;
    }

    module.exports = Model;

### Create a Controller

Every Model you will have will be paired with a Controller.

Controllers are used to handle data creation and manipulation for the back-end of your site. These are what allow you to assign data endpoints for your front-end services to access. If you are also going to be using vern-authentication then controllers will be used to assign permissions for different routes.

`vern create controller <name>`



### Create a Directive

Directives are AngularJS components which add behaviors to HTML. If this is a foreign concept to you then it is required that you go back and go over the Angular documentation listed earlier.

`vern create directive <admin|frontend> <name>`

This command will generate a directive javascript file, an HTML file, and a LESS file for styling. One simple example that a directive is handy for is generating dynamic views based on list of content. Here is a directive that generates blog entries:

    angular.module('BlogApp')
        .directive('blogObject', function() {
            return {
                restrict: 'E',
                scope: {blog: '='},
                replace: true,
                templateUrl: 'template/blog-object.html',
                link: function(scope, element, attrs) {
                }
            }
        });

    angular.module('BlogApp').run('$templateCache', function($templateCache) {
        $templateCache.put('template/blog-object.html',
            '<div class="blog-object">' +
            '   <div class="image-holder">' +
            '       <img src="{{blog.thumbnail}}"/>
            '   </div>' +
            '   <h2 class="title" ng-bind="blog.title"></h2>' +
            '   <div class="author" ng-bind="blog.author"></div>' +
            '   <div class="timestamp" ng-bind="blog.created_at"></div>' +
            '   <div class="content" ng-bind="blog.text_content"></div>' +
            '</div>'
        );

*Notice that the scope does not require a '$' in front of it while writing a directive in VERN.*

In this example we are using ($templateCache)[https://docs.angularjs.org/api/ng/service/$templateCache] to generate the view on the same page.

Next you will have to put this in your HTML DOM like this:

    <blog-object ng-repeat="b in blogs" blog="b"></blog-object>

If you are sitting their thinking 'Wait where did `blogs` suddenly come from?' Don't worry. We are going to use an Angular controller combined with a service in order to get that data...

### Create a Service

Services are used to retrieve data for the front-end from the backend.

`vern create service <admin|frontend> <name> [--use-factory || --use-provider]`

These come in three flavors [services, factories, and providers](http://stackoverflow.com/questions/15666048/angular-js-service-vs-provider-vs-factory). For this example we will just be using factories (which require a return value). This service will use a pre-built service `apiRequest` to get data from the server based on parameters given.

    angular.module('BlogApp')
        .factory('blogManager', function($scope, apiRequest) {
            this = $scope;
            $scope.blogs = null;
            apiRequest.get({
                path: '/blogs',
                success : function(res) {
                    $scope.blogs = res.pkg.data;
                }
            });
            return $scope;
        });

From this point we can go into our front-end BlogController that you created earlier (when you created the view) and pass that service into the view.

    angular.module('BlogApp')
        .controller('BlogController', function(blogManager) {
            $scope.blogs = blogmanager.blogs;
        });


### Create a Filter

`vern create filter <admin|frontend> <name>`

## Starting a Project Server

`vern start <api|frontend|admin|all>` - starts the specified server component or all of them. Use CTRL+C to exit.

*TODO: Use forever or nodemon to watch file directories for updates*
`vern <create|install|package|deploy|config> <options, ...>`