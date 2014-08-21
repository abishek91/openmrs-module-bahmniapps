'use strict';

angular.module('admin', ['admin', 'httpErrorInterceptor', 'bahmni.common.uiHelper', 'bahmni.common.util', 'bahmni.common.appFramework', 'ngCookies', 'ui.router', 'angularFileUpload']);

angular.module('admin').config(['$stateProvider', '$httpProvider', '$urlRouterProvider', function ($stateProvider, $httpProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/dashboard');
    $stateProvider.state('admin', {
        abstract: true,
        template: '<ui-view/>',
        resolve: {
            initialize: 'init'
        }
    }).state('admin.dashboard',
        {   url: '/dashboard',
            templateUrl: '../common/ui-helper/views/dashboard.html',
            controller: 'DashboardController'
        }).state('admin.csv',
        {   url: '/csv',
            templateUrl: 'views/csvupload.html',
            controller: 'CSVUploadController'

        });
    $httpProvider.defaults.headers.common['Disable-WWW-Authenticate'] = true;
}]).
    run(function ($rootScope, $templateCache) {
        //Disable caching view template partials
        $rootScope.$on('$viewContentLoaded', function () {
                $templateCache.removeAll();
            }
        )
    });