'use strict';

angular.module('admin').factory('init', ['$rootScope', '$q', 'appService', 'spinner',
    function ($rootScope, $q, appService, spinner) {
        var initApp = function () {
            return appService.initApp('admin');
        };

        return spinner.forPromise(initApp());
    }
]);