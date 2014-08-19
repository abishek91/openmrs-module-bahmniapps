'use strict';


angular.module('bahmni.admin', ['ngRoute', 'httpErrorInterceptor', 'bahmni.common.uiHelper', 'bahmni.common.util', 'bahmni.common.appFramework', 'ngCookies', 'ui.router'])
.provider('$cookieStore', [function(){
    var self = this;
    self.defaultOptions = {};

    self.setDefaultOptions = function(options){
        self.defaultOptions = options;
    };

    self.$get = function(){
        return {
            get: function(name){
                var jsonCookie = $.cookie(name);
                if(jsonCookie){
                    return angular.fromJson(jsonCookie);
                }
            },
            put: function(name, value, options){
                options = $.extend({}, self.defaultOptions, options);
                $.cookie(name, angular.toJson(value), options);
            },
            remove: function(name, options){
                options = $.extend({}, self.defaultOptions, options);
                $.removeCookie(name, options);
            }
        };
    };
}]).config(['$routeProvider', '$httpProvider', '$stateProvider', function ($routeProvider, $httpProvider) {
    $routeProvider.when('/dashboard',
    {
        templateUrl: '../common/ui-helper/views/dashboard.html',
        controller: 'DashboardController',
        resolve: {
            appName: function () {
                return 'admin'
            }
        }
    });
    $routeProvider.when('/csv',
    {
        templateUrl: 'views/csvupload.html',
        controller: 'CSVUploadController'
    });
    $routeProvider.otherwise({redirectTo: '/dashboard'});
    $httpProvider.defaults.headers.common['Disable-WWW-Authenticate'] = true;
}]).run(function ($rootScope, $templateCache) {
//        Disable caching view template partials
        $rootScope.$on('$viewContentLoaded', function () {
            $templateCache.removeAll();
        }
        )
    });
