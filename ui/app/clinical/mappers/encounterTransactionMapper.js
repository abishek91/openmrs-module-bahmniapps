'use strict';

Bahmni.Clinical.EncounterTransactionMapper = function () {

    var addEditedDiagnoses = function (consultation, diagnosisList) {
        consultation.pastDiagnoses && consultation.pastDiagnoses.forEach(function (diagnosis) {
            if (diagnosis.isDirty) {
                diagnosis.diagnosisDateTime = null;
                diagnosisList.push(diagnosis);
            }
        });
        consultation.savedDiagnosesFromCurrentEncounter && consultation.savedDiagnosesFromCurrentEncounter.forEach(function (diagnosis) {
            if (diagnosis.isDirty) {
                diagnosis.diagnosisDateTime = null;
                diagnosisList.push(diagnosis);
            }
        });
    };

    var isRetrospectiveEntry = function(encounterDate) {
        return encounterDate < Bahmni.Common.Util.DateUtil.getDateWithoutTime(Bahmni.Common.Util.DateUtil.now());
    }

    this.map = function (consultation, patient, locationUuid) {

        var encounterData = {};
        encounterData.locationUuid = locationUuid;
        encounterData.patientUuid = patient.uuid;

        if (isRetrospectiveEntry(consultation.encounterDate) ) {
            encounterData.encounterDateTime = consultation.encounterDate;
            encounterData.visitType = "OPD";
        }

        if (consultation.newlyAddedDiagnoses && consultation.newlyAddedDiagnoses.length > 0) {
            encounterData.bahmniDiagnoses = consultation.newlyAddedDiagnoses.map(function (diagnosis) {
                return {
                    codedAnswer: { uuid: !diagnosis.isNonCodedAnswer ? diagnosis.codedAnswer.uuid : undefined},
                    freeTextAnswer: diagnosis.isNonCodedAnswer ? diagnosis.codedAnswer.name : undefined,
                    order: diagnosis.order,
                    certainty: diagnosis.certainty,
                    existingObs: null,
                    diagnosisDateTime: null,
                    diagnosisStatusConcept: diagnosis.diagnosisStatusConcept,
                    voided: diagnosis.voided,
                    comments: diagnosis.comments
                }
            });
        } else {
            encounterData.bahmniDiagnoses = [];
        }
        addEditedDiagnoses(consultation, encounterData.bahmniDiagnoses);

        encounterData.testOrders = consultation.investigations.map(function (investigation) {
            return { uuid: investigation.uuid, concept: {uuid: investigation.concept.uuid }, orderTypeUuid: investigation.orderTypeUuid, voided: investigation.voided || false};
        });

        consultation.drugOrders = [];
        var newlyAddedTreatments = consultation.newlyAddedTreatments;
        newlyAddedTreatments && newlyAddedTreatments.forEach(function (treatment) {
            consultation.drugOrders.push(Bahmni.Clinical.DrugOrder.createFromUIObject(treatment));
        });
        if(consultation.removableDrugs) {
            consultation.drugOrders = consultation.drugOrders.concat(consultation.removableDrugs);
        }

        encounterData.drugOrders = consultation.drugOrders;

        encounterData.disposition = consultation.disposition;

        var addObservationsToEncounter = function () {
            encounterData.observations = consultation.observations || [];

            if (consultation.consultationNote) {
                encounterData.observations.push(consultation.consultationNote);
            }
            if (consultation.labOrderNote) {
                encounterData.observations.push(consultation.labOrderNote);
            }
        };

        addObservationsToEncounter();

        return encounterData;
    };
};