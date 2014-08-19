'use strict';

angular.module('bahmni.common.uiHelper')
    .controller('DashboardController', ['$scope', '$location', 'appService', '$q', 'sessionService', 'spinner', '$window', 'appName', function ($scope, $location, appService, $q, sessionService, spinner, $window, appName) {
        $scope.appExtensions = [];

        var initializeExtenstions = function() {
            $scope.appExtensions = appService.getAppDescriptor().getExtensions("org.bahmni.dashboard", "link");
        };

        var initialize = function(appName) {
            return appService.initApp(appName).then(initializeExtenstions);
        };

        spinner.forPromise(initialize(appName));
    }]);