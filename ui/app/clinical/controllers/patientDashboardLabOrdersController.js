angular.module('bahmni.clinical')
    .controller('PatientDashboardLabOrdersController', ['$scope', '$rootScope', '$stateParams', 'LabOrderResultService', '$q', 'spinner', 'clinicalConfigService',
        function ($scope, $rootScope, $stateParams, labOrderResultService, $q, spinner, clinicalConfigService) {
            $scope.patientUuid = $stateParams.patientUuid;
            $scope.showNormalLabResults = true;

            $scope.labOrderControlParameters = {
                patientUuid: $scope.patientUuid,
                numberOfVisits: 1
            };

            var init = function () {
                spinner.forPromise(labOrderResultService.getAllForPatient($scope.patientUuid, 1).then(function (results) {
                    var sortedConceptSet = new Bahmni.Clinical.SortedConceptSet($rootScope.allTestsAndPanelsConcept);
                    $scope.labAccessions = flattened(results.accessions.map(sortedConceptSet.sortTestResults));
                }));
                var labResultSection = clinicalConfigService.getPatientDashBoardSectionByName("labOrders");
                $scope.showNormalLabResults = labResultSection.showNormalValues !== undefined ? labResultSection.showNormalValues : true;
            };

            init();

            var flattened = function (accessions) {
                return accessions.map(function (results) {
                    return _.flatten(results, function (result) {
                        return result.isPanel == true ? [result, result.tests] : result;
                    });
                });
            };

            $scope.getUploadedFileUrl = function (uploadedFileName) {
                return Bahmni.Common.Constants.labResultUploadedFileNameUrl + uploadedFileName;
            };

            $scope.hasLabOrders = function () {
                return $scope.labAccessions && $scope.labAccessions.length > 0;
            };
        }]);