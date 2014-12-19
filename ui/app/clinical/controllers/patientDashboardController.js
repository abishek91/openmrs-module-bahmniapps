'use strict';

angular.module('bahmni.clinical')
    .controller('PatientDashboardController', ['$scope', '$rootScope', '$location', '$stateParams', 
        'encounterService', 'clinicalConfigService', 'diseaseTemplateService',
        function ($scope, $rootScope, $location, $stateParams, encounterService, 
                  clinicalConfigService, diseaseTemplateService) {
            
            $scope.patientUuid = $stateParams.patientUuid;
            $scope.patientSummary = {};
            $scope.activeVisitData = {};
            $scope.obsIgnoreList = clinicalConfigService.getObsIgnoreList();
            $scope.patientDashboardSections = _.map(clinicalConfigService.getAllPatientDashboardSections(), Bahmni.Clinical.PatientDashboardSection.create);

            diseaseTemplateService.getLatestDiseaseTemplates($stateParams.patientUuid).then(function (diseaseTemplates) {
                $scope.diseaseTemplates = diseaseTemplates;
                $scope.diseaseTemplates.forEach(function (diseaseTemplate) {
                    if (diseaseTemplate.notEmpty()) {
                        $scope.patientDashboardSections.push(new Bahmni.Clinical.PatientDashboardSection({
                            title: diseaseTemplate.label,
                            name: 'diseaseTemplateSection',
                            data: {diseaseTemplateName: diseaseTemplate.name}
                        }));
                    }
                });
            });

            $scope.filterOdd = function (index) {
                return function () {
                    return index++ % 2 == 0;
                };
            };

            $scope.filterEven = function (index) {
                return function () {
                    return index++ % 2 == 1;
                };
            };

            var getEncountersForVisit = function (visitUuid) {
                encounterService.search(visitUuid).then(function (encounterTransactionsResponse) {
                    $scope.visit = Bahmni.Clinical.Visit.create(encounterTransactionsResponse.data, $scope.consultationNoteConcept, $scope.labOrderNotesConcept, $scope.encounterConfig, $rootScope.allTestsAndPanelsConcept, $scope.obsIgnoreList, visitUuid, conceptSetUiConfigService.getConfig(), $rootScope.encounterDate);
                });
            };

            var clearPatientSummary = function () {
                $scope.patientSummary = undefined;
            };

            $scope.showVisitSummary = function (visit) {
                clearPatientSummary();
                $scope.selectedVisit = visit;
                getEncountersForVisit($scope.selectedVisit.uuid);
            };

            $scope.getDiseaseTemplateSection = function (diseaseName) {
                return _.find($scope.diseaseTemplates, function (diseaseTemplate) {
                    return diseaseTemplate.name === diseaseName;
                });
            };
        }]);
