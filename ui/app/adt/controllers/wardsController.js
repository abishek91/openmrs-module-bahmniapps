'use strict';

angular.module('bahmni.adt')
    .controller('WardsController', ['$scope', '$rootScope', '$window', '$document', '$anchorScroll', 'spinner', 'WardService',
        function ($scope, $rootScope, $window, $document, $anchorScroll, spinner, wardService) {
            $scope.wards = null;

            var init = function () {
                return loadAllWards();
            };

            var loadAllWards = function () {
                return wardService.getWardsList().success(function (wardsList) {
                    $scope.wards = wardsList.results;
                });
            };
            spinner.forPromise(init());

        }]);
