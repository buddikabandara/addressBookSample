'use strict';

// Declare app level module which depends on other modules
var sample_AddressBook = angular.module('addressSampleBook', [
	'ngMaterial',
    'ngRoute',
	'ngCookies',
	'ngAnimate'
 ]);
sample_AddressBook.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(true); // testing issue #144
  }]).
  config(['$routeProvider', function ($routeProvider) {
	  
    $routeProvider.when('/', {templateUrl: 'partials/allContact.html',  controller: 'allContactCtrl'});
	
  }])
 
 .run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
    var original = $location.path;
    $location.path = function (path, reload) {
        if (reload === false) {
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
                un();
            });
        }
        return original.apply($location, [path]);
    };
}]);



