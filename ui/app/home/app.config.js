define([], function(){
    require.config({
                       baseUrl: ".",
                       paths: {
                           /*Libs*/
                           "jquery":"../components/jquery/jquery",
                           "jqueryui":"../lib/jquery/jquery-ui-1.10.4.custom.min",
                           "jquery-cookie": "../components/jquery.cookie/jquery.cookie",
                           "angular": "../components/angular/angular",
                           "angular-route": "../components/angular-route/angular-route",
                           "angular-cookie": "../components/angular-cookies/angular-cookies",
                           "ng-infinite-scroll": "../components/ngInfiniteScroll/ng-infinite-scroll",
                           "common-constants": "../common/constants",
                           "common-init": "../common/util/init",
                           "httpErrorInterceptor": "../common/util/httpErrorInterceptor",
                           "arrayUtil": "../common/util/arrayUtil",
                           "authentication": "../common/auth/authentication",
                           "framework-init": "../common/app-framework/init",
                           "appDescriptor": "../common/app-framework/models/appDescriptor",
                           "appService": "../common/app-framework/services/appService",
                           "ui-init": "../common/ui-helper/init",
                           "spinner": "../common/ui-helper/spinner",
                            /*Controllers*/
                            "loginController": "controllers/loginController",
                            "dashboardController": "controllers/dashboardController"
                       },
                       shim: {
                         'jquery': {
                            exports: '$'
                         },
                         'angular': {
                             exports: 'angular'
                         },
                         'jqueryui':['jquery'],
                         'jquery-cookie':['jquery'],
                         'angular-route':['angular'],
                         'angular-cookie':['angular'],
                         'ng-infinite-scroll':['angular'],
                         'common-constants':[],
                         'common-init':['angular'],
                         'httpErrorInterceptor':['angular'],
                         'arrayUtil':[],
                         'authentication':['angular'],
                         'framework-init':['angular'],
                         'appDescriptor':['angular'],
                         'appService':['appService'],
                         'ui-init':['angular'],
                         'spinner':['angular']
                       },
                       waitSeconds: 15
    });
})