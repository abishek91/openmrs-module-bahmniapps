angular.module('bahmni.clinical')
    .directive('labOrderLine', function () {
        var controller = function ($scope) {
            $scope.toggle = function (line) {
                line.showNotes = !line.showNotes;
            };
            $scope.hasNotes = function (line) {
                return line.notes ? true : false;
            };
            $scope.showTestNotes = function (line) {
                return true && $scope.hasNotes(line); //consider configuration for notes
            }
        };
        return {
            restrict: 'A',
            controller: controller,
            scope: {
                test: "="
            },
            templateUrl: "views/labOrderLine.html"
        };
    });