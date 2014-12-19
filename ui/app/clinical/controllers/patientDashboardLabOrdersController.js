'use strict';

angular.module('bahmni.clinical')
    .controller('PatientDashboardLabOrdersController', ['$scope', '$stateParams', 'clinicalConfigService',
        function ($scope, $stateParams, clinicalConfigService) {
            var shouldShowNormalResults = function () {
                var labResultSection = clinicalConfigService.getPatientDashBoardSectionByName("labOrders");
                return labResultSection.showNormalValues !== undefined ? labResultSection.showNormalValues : true;
            };

            $scope.labOrderControlParameters = {
                patientUuid: $stateParams.patientUuid,
                numberOfVisits: 1,
                showNormalLabResults: true,
                showInvestigationChart: false,
                showNormalValues: shouldShowNormalResults()
            };
        }]);