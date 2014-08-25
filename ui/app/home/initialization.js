'use strict';

angular.module('bahmni.home').factory('init', ['$rootScope', '$q', 'appService', 'spinner',
    function ($rootScope, $q, appService, spinner) {
        var initApp = function () {
            return appService.initApp('home');
        };

        return spinner.forPromise(initApp());
    }
]);