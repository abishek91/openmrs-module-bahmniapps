'use strict';

describe("DiagnosisMapper", function () {
    var ruledOutConcept = {
        name: "Ruled Out",
        uuid: "1234-1234-1233-1231"
    };

    describe("prepareForSave", function () {
        it("should map new ruled out diagnosis to a new observation", function () {
            var diagnosisUuid = "3ccdf6b8-26fe-102b-80cb-0017a47871b2";
            var consultation = {
                diagnoses:[
                    new Bahmni.Clinical.Diagnosis({uuid:diagnosisUuid}, "PRIMARY", Bahmni.Common.Constants.ruledOutCertainty)
                ],
                observations:[]
            };

            new Bahmni.DiagnosisMapper(consultation, ruledOutConcept).prepareForSave();
            expect(consultation.observations.length).toBe(1);
            var ruledOutObservation = consultation.observations[0];
            expect(ruledOutObservation.concept.uuid).toBe(ruledOutConcept.uuid);
            expect(ruledOutObservation.value).toBe(diagnosisUuid);
            expect(ruledOutObservation.uuid).toBe(undefined);
        });

        it("should map past diagnoses", function () {
            var diagnosisUuid = "3ccdf6b8-26fe-102b-80cb-0017a47871b2";
            var diagnosis = new Bahmni.Clinical.Diagnosis({uuid:diagnosisUuid}, "PRIMARY", "PRESUMED");
            diagnosis.isDirty = true;
            var consultation = {
                pastDiagnoses:[
                    diagnosis
                ],
                diagnoses:[],
                observations:[]
            };

            new Bahmni.DiagnosisMapper(consultation, ruledOutConcept).prepareForSave();
            expect(consultation.diagnoses.length).toBe(1);
            var savedDiagnosis = consultation.diagnoses[0];
            expect(savedDiagnosis.codedAnswer.uuid).toBe(diagnosisUuid);
        });

        it("should map existing ruled out diagnosis (that has changed diagnosis concept) to an observation with existingObs", function () {
            var diagnosisUuid = "3ccdf6b8-26fe-102b-80cb-0017a47871b2";
            var newDiagnosisUuid = "new-diagnosis-uuid";
            var currentObservationUuid = "f28885ca-d11b-488c-bad0-959de0847eec";
            var diagnosis = new Bahmni.Clinical.Diagnosis({uuid:newDiagnosisUuid}, "PRIMARY", Bahmni.Common.Constants.ruledOutCertainty, currentObservationUuid);
            diagnosis.fromRuledOutObs = true;
            var consultation = {
                diagnoses:[
                    diagnosis
                ],
                observations:[]
            };

            new Bahmni.DiagnosisMapper(consultation, ruledOutConcept).prepareForSave();
            expect(consultation.observations.length).toBe(1);
            var ruledOutObservation = consultation.observations[0];
            expect(ruledOutObservation.concept.uuid).toBe(ruledOutConcept.uuid);
            expect(ruledOutObservation.value).toBe(newDiagnosisUuid);
            expect(ruledOutObservation.uuid).toBe(currentObservationUuid);
        });

        it("should map edited non-ruled-out diagnosis (that is now ruled out) by voiding diagnosis observation and adding a ruled out observation", function () {
            var diagnosisUuid = "3ccdf6b8-26fe-102b-80cb-0017a47871b2";
            var currentObservationUuid = "f28885ca-d11b-488c-bad0-959de0847eec";
            var consultation = {
                diagnoses:[
                    new Bahmni.Clinical.Diagnosis({uuid:diagnosisUuid}, "PRIMARY", Bahmni.Common.Constants.ruledOutCertainty, currentObservationUuid)
                ],
                observations:[]
            };

            new Bahmni.DiagnosisMapper(consultation, ruledOutConcept).prepareForSave();
            expect(consultation.observations.length).toBe(1);
            expect(consultation.diagnoses.length).toBe(1);
            var ruledOutObservation = consultation.observations[0];
            expect(ruledOutObservation.concept.uuid).toBe(ruledOutConcept.uuid);
            expect(ruledOutObservation.value).toBe(diagnosisUuid);
            expect(ruledOutObservation.uuid).toBe(undefined);
            var diagnosis = consultation.diagnoses[0];
            expect(diagnosis.voided).toBeTruthy();
        });
    });

    describe("mapAllLoadedDiagnoses", function(){
        it("should map ruled out observations as diagnosis with ruled out as certainty", function () {
            var consultation = {
                observations: [
                    {
                        "uuid": "fe52924b-57de-4f72-ac0a-7c6d9f92fb97",
                        "observationDateTime": "2014-04-01T11:07:06.000+0530",
                        "value": {
                            "uuid": "3ccca7cc-26fe-102b-80cb-0017a47871b2",
                            "name": "Tuberculosis"
                        },
                        "concept": ruledOutConcept
                    },
                    {
                        "uuid": "fe52924b-57de-4f72-ac0a-7c6d9f92fb97",
                        "observationDateTime": "2014-04-01T11:07:06.000+0530",
                        "value": {
                            "uuid": "3ccca7cc-26fe-102b-80cb-0017a4787tt2",
                            "name": "Headache"
                        },
                        "concept": ruledOutConcept
                    }
                ],
                diagnoses: []
            };

            new Bahmni.DiagnosisMapper(consultation).mapAllLoadedDiagnoses([], [], ruledOutConcept);
            expect(consultation.observations.length).toBe(0);
            expect(consultation.diagnoses.length).toBe(2);
            consultation.diagnoses.forEach(function(diagnosis){
                expect(diagnosis.certainty).toBe(Bahmni.Common.Constants.ruledOutCertainty);
            });
        });

        it("should map past ruled out diagnosis", function () {
            var consultation = {
                observations: [],
                diagnoses: []
            };

            var diagnosisUuid1 = "114127AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
            var diagnosisUuid2 = "114127AAAAAAAAAAAAAAAAAAAAAAAAAAAAGG";
            var allRuledOutObservations = [
                {
                    "uuid": "80859c26-9f1a-4cbb-a403-debc2ddb0a52",
                    "obsDatetime": "2014-04-01T08:48:19.385Z",
                    "value": {
                        "uuid": diagnosisUuid1,
                        "name": {
                            "name": "Placenta Praevia"
                        }
                    }
                },
                {
                    "uuid": "80859c26-9f1a-4cbb-a403-debc2ddb0att",
                    "obsDatetime": "2014-04-01T04:48:19.385Z",
                    "value": {
                        "uuid": diagnosisUuid2,
                        "name": {
                            "name": "Placenta Praevia"
                        }
                    }
                }
            ];

            var pastDiagnoses = [
                new Bahmni.Clinical.Diagnosis({"uuid": diagnosisUuid1},"PRIMARY", "PRESUMED",null, null, "2014-04-01T06:48:19.385Z"),
                new Bahmni.Clinical.Diagnosis({"uuid": diagnosisUuid2},"PRIMARY", "PRESUMED",null, null, "2014-04-01T06:48:19.385Z")
            ];

            new Bahmni.DiagnosisMapper(consultation).mapAllLoadedDiagnoses(pastDiagnoses, allRuledOutObservations, ruledOutConcept);
            expect(consultation.observations.length).toBe(0);
            expect(consultation.pastDiagnoses.length).toBe(2);
            var diagnosis1 = consultation.pastDiagnoses.filter(function(diagnosis){
                return diagnosis.codedAnswer.uuid == diagnosisUuid1;
            })[0];
            var diagnosis2 = consultation.pastDiagnoses.filter(function(diagnosis){
                return diagnosis.codedAnswer.uuid == diagnosisUuid2;
            })[0];
            expect(diagnosis1.certainty).toBe(Bahmni.Common.Constants.ruledOutCertainty);
            expect(diagnosis2.certainty).toBe("PRESUMED");
        });
    });
});