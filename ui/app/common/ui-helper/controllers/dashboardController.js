'use strict';

angular.module('bahmni.common.uiHelper')
    .controller('DashboardController', ['$scope', '$location', 'appService', function ($scope, $location, appService) {
        var initializeExtenstions = function() {
            $scope.appExtensions = appService.getAppDescriptor().getExtensions("org.bahmni.dashboard", "link") || [];
        };

        initializeExtenstions();
    }]);