'use strict';

angular.module('opd.consultation.controllers')
    .controller('ConsultationController', ['$scope', '$rootScope', 'consultationService', '$route', '$location', function ($scope, $rootScope, consultationService, $route, $location) {

    $scope.save = function () {
        
        var encounterData = {};
        encounterData.patientUuid = $scope.patient.uuid;
        encounterData.encounterTypeUuid = $rootScope.encounterConfig.getOpdConsultationEncounterUuid();

        if ($rootScope.consultation.diagnoses && $rootScope.consultation.diagnoses.length > 0){
            encounterData.diagnoses = $rootScope.consultation.diagnoses.map(function (diagnosis) {
                return {
                    diagnosis:"ConceptUuid:" + diagnosis.concept.conceptUuid,
                    order:diagnosis.order,
                    certainty:diagnosis.certainty,
                    existingObs:diagnosis.existingObsUuid
                }
            });
        }

        encounterData.testOrders = $rootScope.consultation.investigations.map(function (investigation) {
            return { uuid:investigation.uuid, conceptUuid:investigation.conceptUuid, orderTypeUuid:investigation.orderTypeUuid };
        });

        var startDate = new Date();
        var allTreatmentDrugs = $rootScope.consultation.treatmentDrugs || [];
        var newlyAddedTreatmentDrugs = allTreatmentDrugs.filter(function (drug) {
            return !drug.savedDrug;
        });

        if (newlyAddedTreatmentDrugs) {
            encounterData.drugOrders = newlyAddedTreatmentDrugs.map(function (drug) {
                return drug.requestFormat(startDate);
            });
        }

        encounterData.disposition = $rootScope.disposition.adtToStore;

        var addObservationsToEncounter = function(){
            encounterData.observations = [];
            for (var i in $rootScope.observationList) {
                if ($rootScope.observationList[i]) {
                    encounterData.observations = encounterData.observations.concat($rootScope.observationList[i].observations);
                }
            }
        };
        addObservationsToEncounter();

        consultationService.create(encounterData).success(function () {
            window.location = Bahmni.Opd.Constants.activePatientsListUrl;
        });
    };
}]);
