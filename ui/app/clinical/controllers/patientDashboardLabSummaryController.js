'use strict';

angular.module('bahmni.clinical')
    .controller('PatientDashboardLabSummaryController', ['$scope', '$rootScope', 'LabOrderResultService', 'spinner',
        function ($scope, $rootScope, labOrderResultService, spinner) {

            $scope.labOrderControlParameters = {
                patientUuid: $rootScope.patient.uuid,
                showNormalLabResults: true,
                title: "Lab Investigations (without Accession Notes)",
                numberOfVisits: 3
            };

            spinner.forPromise(labOrderResultService.getAllForPatient($rootScope.patient.uuid, $scope.labOrderControlParameters.numberOfVisits).then(function (results) {
                $scope.labResults = results;
            }));
        }]);