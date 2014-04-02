Bahmni.DiagnosisMapper = function (consultation, ruledOutDiagnosisConcept) {
    var ruledOutDiagnosisConcept = ruledOutDiagnosisConcept;
    this.prepareForSave = function () {
        var ruledOutDiagnosisObservations = [];

        preparePastDiagnosesForSave(ruledOutDiagnosisObservations);

        var diagnoses = Bahmni.Common.Util.ArrayUtil.clone(consultation.diagnoses);
        consultation.diagnoses.forEach(function (currentDiagnosis) {
            if (currentDiagnosis.isRuledOut()) {
                handleRulingOutDiagnosesInCurrentEncounterSession(ruledOutDiagnosisObservations, currentDiagnosis, diagnoses);
            }
        });
        consultation.diagnoses = diagnoses;
        consultation.observations = consultation.observations.concat(ruledOutDiagnosisObservations);
    };

    var preparePastDiagnosesForSave = function(ruledOutDiagnosisObservations){
        if(consultation.pastDiagnoses && consultation.pastDiagnoses.length > 0){
            var pastDiagnoses = Bahmni.Common.Util.ArrayUtil.clone(consultation.pastDiagnoses);
            consultation.pastDiagnoses.forEach(function (pastDiagnosis) {
                if (pastDiagnosis.isDirty) {
                    if(pastDiagnosis.isRuledOut()){
                        ruledOutDiagnosisObservations.push({ value:pastDiagnosis.codedAnswer.uuid, concept:{uuid:ruledOutDiagnosisConcept.uuid}});
                        Bahmni.Common.Util.ArrayUtil.removeItem(pastDiagnoses, pastDiagnosis);
                    }else{
                        var editedPastDiagnosis = angular.extend(new Bahmni.Clinical.Diagnosis(pastDiagnosis.codedAnswer), pastDiagnosis);
                        editedPastDiagnosis.existingObs = ''; // this should be saved as a new observation
                        consultation.diagnoses.push(editedPastDiagnosis);
                    }

                }
            });
            consultation.pastDiagnoses = pastDiagnoses;
        }
    };

    var handleRulingOutDiagnosesInCurrentEncounterSession = function (observationsList, currentDiagnosis, diagnosesToSave) {

        observationsList = observationsList || [];

        var observationToSave = {
            value:currentDiagnosis.codedAnswer.uuid,
            concept:{uuid:ruledOutDiagnosisConcept.uuid},
            voided:currentDiagnosis.voided
        };

        Bahmni.Common.Util.ArrayUtil.removeItem(diagnosesToSave, currentDiagnosis);

        if (currentDiagnosis.isNew()) {
            // new ruled out diagnosis
            Bahmni.Common.Util.ArrayUtil.removeItem(diagnosesToSave, currentDiagnosis);
            observationsList.push(observationToSave);
        } else {
            if (currentDiagnosis.fromRuledOutObs) {
                //edit concept for existing RO
                observationToSave.uuid = currentDiagnosis.existingObs;
                observationToSave.observationDateTime = currentDiagnosis.diagnosisDateTime;
//                Bahmni.Common.Util.ArrayUtil.removeItem(consultation.observations, ruledOutObservation);
            }
            else {
                //changing presumed to RO
                currentDiagnosis.voided = true;
                diagnosesToSave.push(currentDiagnosis);
            }

            observationsList.push(observationToSave);
        }
    };

    this.mapEditedPastDiagnoses = function(diagnosisList){
        consultation.pastDiagnoses.forEach(function(pastDiagnosis){
            if (pastDiagnosis.isDirty) {
                diagnosisList.push(pastDiagnosis);
            }
        });
    };

    this.mapAllLoadedDiagnoses = function (pastDiagnosesResponse, allRuledOutDiagnosesObservations, ruledOutDiagnosisConcept) {
        //Filter out all the past ruled out diagnoses from all ruled out diagnoses
        var pastRuledOutObservations = allRuledOutDiagnosesObservations.filter(function (ruledOutObservation) {
            var isPresent = Bahmni.Common.Util.ArrayUtil.presentInList(consultation.observations, ruledOutObservation, "['value']['uuid']");
            return !isPresent;
        });

        // Add current encounter ruled out observations to encounter diagnoses
        var observationList = Bahmni.Common.Util.ArrayUtil.clone(consultation.observations);
        consultation.observations.forEach(function (observation) {
            if (isRuledOutObservation(observation, ruledOutDiagnosisConcept)) {
                var ruledOutDiagnosis = new Bahmni.Clinical.Diagnosis(observation.value, null, Bahmni.Common.Constants.ruledOutCertainty, observation.uuid, null, observation.observationDateTime);
                ruledOutDiagnosis.fromRuledOutObs = true;
                consultation.diagnoses.push(ruledOutDiagnosis);
                Bahmni.Common.Util.ArrayUtil.removeItem(observationList, observation);
            }
        });
        consultation.observations = observationList;

        //filter current diagnoses from past
        mapPastDiagnosis(pastDiagnosesResponse, pastRuledOutObservations);
    };

    var mapPastDiagnosis = function (pastDiagnosesResponse, ruledOutObservations) {
        consultation.pastDiagnoses = consultation.pastDiagnoses || [];

        pastDiagnosesResponse.forEach(function (pastDiagnosis) {
            if (!presentInList(pastDiagnosis, consultation.diagnoses) && !presentInList(pastDiagnosis, consultation.pastDiagnoses)){
                if (hasLatestRuledOutObservation(pastDiagnosis, ruledOutObservations)) {
                    pastDiagnosis.certainty = Bahmni.Common.Constants.ruledOutCertainty;
                }
                consultation.pastDiagnoses.push(angular.extend(new Bahmni.Clinical.Diagnosis(pastDiagnosis.codedAnswer), pastDiagnosis));
            }
        });

        //Add ruled out diagnoses which were not in the past diagnoses
        ruledOutObservations.forEach(function(pastRuledOutObservation){
            var ruledOutDiagnosis = new Bahmni.Clinical.Diagnosis(
                {
                    uuid:pastRuledOutObservation.value.uuid,
                    name:pastRuledOutObservation.value.name.name
                }, null, Bahmni.Common.Constants.ruledOutCertainty, pastRuledOutObservation.uuid, null, pastRuledOutObservation.observationDateTime);
            if(!presentInList(ruledOutDiagnosis, consultation.pastDiagnoses)){
                consultation.pastDiagnoses.push(ruledOutDiagnosis);
            }
        });
    };

    var isRuledOutObservation = function (observation, ruledOutDiagnosisConcept) {
        return observation.concept.uuid == ruledOutDiagnosisConcept.uuid;
    };

    var presentInList = function (diagnosisToCheck, diagnosisList) {
        if (!diagnosisList) {
            return false;
        }
        return diagnosisList.filter(function (diagnosis) {
            var contains = false;
            if (diagnosisToCheck.freeTextAnswer) {
                contains = diagnosis.freeTextAnswer === diagnosisToCheck.freeTextAnswer;
            }
            else if (diagnosis.codedAnswer) {
                contains = diagnosis.codedAnswer.uuid === diagnosisToCheck.codedAnswer.uuid
            }
            return contains;
        })[0];
    };

    var hasLatestRuledOutObservation = function (diagnosis, ruledOutDiagnoses) {
        if (!ruledOutDiagnoses)
            return false;

        var sortedRuledOutObservation = getLatestBy(ruledOutDiagnoses, "obsDatetime", function (ruledOutDiagnosis) {
            return ruledOutDiagnosis.value.uuid == diagnosis.codedAnswer.uuid;
        });

        if (!sortedRuledOutObservation) return false;
        return sortedRuledOutObservation["obsDatetime"] > diagnosis.diagnosisDateTime;
    };

    var getLatestBy = function (list, comparatorField, matcher) {
        var allRuledOutDiagnosisObservation = list.filter(matcher);
        if (allRuledOutDiagnosisObservation.length == 0) {
            return;
        }

        var sortedRuledOutObservations = allRuledOutDiagnosisObservation.sort(function (a, b) {
            var x = a[comparatorField];
            var y = b[comparatorField];
            return ( (x < y) ? -1 : (x > y ? 1 : 0));
        });

        if (sortedRuledOutObservations.length == 0) {
            return undefined;
        }
        return sortedRuledOutObservations[0];
    };
};
