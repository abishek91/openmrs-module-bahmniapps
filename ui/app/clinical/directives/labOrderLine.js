angular.module('bahmni.clinical')
    .directive('labOrderLine', function () {
        return {
            restrict: 'A',
            scope: {
                test: "="
            },
            templateUrl: "views/labOrderLine.html"
        };
    });