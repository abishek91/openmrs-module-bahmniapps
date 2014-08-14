angular.module('bahmni.common.paginator')
    .directive('visitPaginationLinks', ['$rootScope', '$state', function ($rootScope, $state) {
        var link = function ($scope) {

            var visits = _.clone($scope.visits).reverse();

            var visitIndex = _.findIndex(visits, function(visitHistoryEntry) {
                return $scope.currentVisit != null && visitHistoryEntry.uuid == $scope.currentVisit.uuid;
            });

            $scope.visitHistoryEntry = visits[visitIndex];

            $scope.shouldBeShown = function () {
                return true;
//                return $state.is('patient.visit');
            };

            $scope.hasNext = function () {
                return visitIndex != -1 && visitIndex < (visits.length - 1);
            };

            $scope.hasPrevious = function () {
                return visitIndex > 0;
            };

            $scope.next = function () {
                if ($scope.hasNext() && $scope.nextFn) {
                    $scope.nextFn()(visits[visitIndex+1].uuid);
                }
            };

            $scope.previous = function () {
                if ($scope.hasPrevious() && $scope.previousFn) {
                    $scope.previousFn()(visits[visitIndex-1].uuid);
                }
            };
        };

        return {
            restrict: 'EA',
            scope: {
                currentVisit: "=",
                visits: "=",
                nextFn: "&",
                previousFn: "&"
            },
            link: link,
            templateUrl: '../common/visit-paginator/visitPagination.html'
        }
    }])
;