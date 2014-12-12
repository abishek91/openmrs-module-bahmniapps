angular.module('bahmni.clinical')
    .controller('PatientDashboardLabSummaryController', ['$scope', '$rootScope', 'LabOrderResultService', 'spinner',
        function ($scope, $rootScope, labOrderResultService, spinner) {
            $scope.showInvestigationChart = false;
            $scope.toggleInvestigationChart = function () {
                $scope.showInvestigationChart = !$scope.showInvestigationChart;
            };


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

            spinner.forPromise(labOrderResultService.getAllForPatient($rootScope.patient.uuid).then(function (results) {
                var sortedConceptSet = new Bahmni.Clinical.SortedConceptSet($rootScope.allTestsAndPanelsConcept);
                $scope.labAccessions = flattened(results.accessions.map(sortedConceptSet.sortTestResults));
                $scope.tabular = results.tabularResult;
                $scope.tabular.tabularResult.orders = sortedConceptSet.sortTestResults($scope.tabular.tabularResult.orders);
            }));
        }]);