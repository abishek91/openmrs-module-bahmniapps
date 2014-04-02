'use strict';

angular.module('bahmni.clinical')
    .controller('DiagnosisController', ['$scope', '$rootScope', '$stateParams', 'diagnosisService', 'contextChangeHandler',
     function ($scope, $rootScope, $stateParams, diagnosisService, contextChangeHandler) {

        $scope.placeholder = "Add Diagnosis";
        $scope.hasAnswers = false;
        $scope.orderOptions = ['PRIMARY', 'SECONDARY'];
        $scope.certaintyOptions = ['CONFIRMED', 'PRESUMED', Bahmni.Common.Constants.ruledOutCertainty];

        $scope.getDiagnosis = function (searchTerm) {
            return diagnosisService.getAllFor(searchTerm);
        };

        var canAdd = function (diagnosis) {
            var canAdd = true;
            $scope.diagnosisList.forEach(function (observation) {
                if(diagnosis.codedAnswer && observation.codedAnswer.uuid === diagnosis.codedAnswer.uuid){
                    canAdd = false;
                }
                else if(diagnosis.freeTextAnswer && observation.freeTextAnswer === diagnosis.freeTextAnswer){
                    canAdd = false;
                }
            });
            return canAdd;
        };

        var filterOutSelectedDiagnoses = function(allDiagnoses){
            return allDiagnoses.filter(function(diagnosis){
                return !alreadyAddedToDiagnosis(diagnosis);
            });
        };

        var alreadyAddedToDiagnosis = function(diagnosis){
            var isPresent = false;
            $scope.diagnosisList.forEach(function(addedDiagnosis){
                if(addedDiagnosis.codedAnswer.uuid == diagnosis.concept.uuid){
                    isPresent = true;
                }
            });
            return isPresent;

        };

        var addDiagnosis = function (concept, index) {
            var diagnosisBeingEdited = $scope.diagnosisList[index];
            if (diagnosisBeingEdited) {
                var diagnosis = new Bahmni.Clinical.Diagnosis(concept, diagnosisBeingEdited.order,
                    diagnosisBeingEdited.certainty, diagnosisBeingEdited.existingObs);
            }
            else {
                var diagnosis = new Bahmni.Clinical.Diagnosis(concept);
            }
            replaceDummyDiagnosisWithBuiltObject(diagnosis, index);
        };

        var replaceDummyDiagnosisWithBuiltObject = function(diagnosis, index){
            if (canAdd(diagnosis)) {
                $scope.diagnosisList.splice(index, 1, diagnosis);
            }
        };

        var addPlaceHolderDiagnosis = function () {
            var diagnosis = new Bahmni.Clinical.Diagnosis('');
            $scope.diagnosisList.push(diagnosis);
        };

        var init = function () {
            if ($rootScope.consultation.diagnoses === undefined || $rootScope.consultation.diagnoses.length === 0) {
                $scope.diagnosisList = [];
            }
            else {
                $scope.diagnosisList = $rootScope.consultation.diagnoses;
            }
            contextChangeHandler.add(allowContextChange);
            addPlaceHolderDiagnosis();
        };

        var allowContextChange = function () {
            var invalidDiagnoses = $scope.diagnosisList.filter(function (diagnosis) {
                return !diagnosis.isValid();
            });
            return invalidDiagnoses.length === 0;
        };

        $scope.cleanOutDiagnosisList = function (data) {
            var mappedResponse = data.map(
                function (concept) {
                    if (concept.conceptName === concept.matchedName) {
                        return {
                            'value':concept.matchedName,
                            'concept':{
                                'name':concept.conceptName,
                                'uuid':concept.conceptUuid
                            },
                            lookup:{
                                'name':concept.conceptName,
                                'uuid':concept.conceptUuid
                            }
                        }
                    }
                    return {
                        'value':concept.matchedName + "=>" + concept.conceptName,
                        'concept':{
                            'name':concept.conceptName,
                            'uuid':concept.conceptUuid
                        },
                        lookup:{
                            'name':concept.conceptName,
                            'uuid':concept.conceptUuid
                        }
                    }
                }
            );
            return filterOutSelectedDiagnoses(mappedResponse);
        };


        $scope.selectItem = function (index, selectedConcept) {
            addDiagnosis(selectedConcept, index);
        };

        $scope.removeObservation = function (index) {
            if (index >= 0) {
                var diagnosisBeingRemoved = $scope.diagnosisList[index];
                if(diagnosisBeingRemoved.existingObs){
                    diagnosisBeingRemoved.voided = true;
                }
                else{
                    Bahmni.Common.Util.ArrayUtil.removeItem($scope.diagnosisList, diagnosisBeingRemoved);
                }
            }
        };

        $scope.$on('$destroy', function () {
            $rootScope.consultation.diagnoses = $scope.diagnosisList.filter(function (diagnosis) {
                return !diagnosis.isEmpty();
            });
        });

        $scope.processDiagnoses = function (data) {
            data.map(
                function (concept) {
                    if (concept.conceptName === concept.matchedName) {
                        return {
                            'value': concept.matchedName,
                            'concept': concept
                        }
                    }
                    return {
                        'value': concept.matchedName + "=>" + concept.conceptName,
                        'concept': concept
                    }
                }
            );
        };

        $scope.clearEmptyRows = function (index) {
            var iter;
            for (iter = 0; iter < $scope.diagnosisList.length; iter++) {
                if ($scope.diagnosisList[iter].isEmpty() && iter !== index) {
                    $scope.diagnosisList.splice(iter, 1)
                }
            }
            var emptyRows = $scope.diagnosisList.filter(function (diagnosis) {
                    return diagnosis.isEmpty();
                }
            );
            if (emptyRows.length == 0) {
                addPlaceHolderDiagnosis();
            }
        };

        $scope.isValid = function (diagnosis) {
            return diagnosis.isValid();
        };

        init();

    }]);
