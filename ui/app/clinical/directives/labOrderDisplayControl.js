angular.module('bahmni.clinical')
    .directive('labOrderDisplayControl', function () {
        var controller = function ($scope) {
            $scope.noLabOrdersMessage = "No Lab Orders for this patient.";

            $scope.hasLabOrders = function () {
                return $scope.accessions && $scope.accessions.length > 0;
            };
            $scope.printJSON = function(item){
                return JSON.stringify(item);
            };

            $scope.hasAbnormalTests = function (labOrderResult) {
                if (labOrderResult.isPanel) {
                    var hasAbnormal = false;
                    labOrderResult.tests.forEach(function (test) {
                        if (test.abnormal) {
                            hasAbnormal = true;
                            return;
                        }
                    });
                    return hasAbnormal;
                }
                return labOrderResult.abnormal;
            };

        };
        return {
            restrict: 'E',
            controller: controller,
            scope: {
                accessions: "="
            },
            templateUrl: "views/labOrderDisplayControl.html"
        };
    });