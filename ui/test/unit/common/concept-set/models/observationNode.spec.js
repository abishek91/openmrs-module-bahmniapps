'use strict';

describe("ObservationNode", function() {
    var headache = buildConcept("Headache", [], []);
    var chiefComplaint = buildConcept("Chief Complaint", [], [], "Computed", "Coded");
    var duration = buildConcept("Chief Complaint Duration", [], [], "Duration", "Numeric");
    var abnormal = buildConcept("Chief Complaint Abnormal", [], [], "Abnormal", "Boolean");
    var chiefComplaintData = buildConcept("Chief Complaint Data", [chiefComplaint, duration, abnormal], [], "Concept Details");

    function createSavedObs() {
        return [{
            "concept": chiefComplaintData,
            "label": "Chief Complaint Data",
            "groupMembers": [{
                "concept": chiefComplaint,
                "label": "Chief Complaint",
                "groupMembers": [],
                "value": headache,
                "voided": false
            },{
                "concept": duration,
                "label": "Duration",
                "groupMembers": [],
                "value": 30,
                "voided": false
            },{
                "concept": abnormal,
                "label": "Abnormal",
                "groupMembers": [],
                "value": true,
                "voided": false
            }],
            "comment": null,
            "voided": false
        }];
    }

    var savedObs = createSavedObs();
    var rootConcept = savedObs[0].concept;
    var mapper = new Bahmni.ConceptSet.ObservationMapper();

    describe("getControlType", function() {
        it("should return freeTextAutocomplete if configured", function() {
            var obsNode = mapper.map(savedObs, rootConcept, {"Chief Complaint": {freeTextAutocomplete: true}});
            expect(obsNode.getControlType()).toBe("freeTextAutocomplete");
        });

        it("should return autocomplete if configured", function() {
            var obsNode = mapper.map(savedObs, rootConcept, {"Chief Complaint": {autocomplete: true}});
            expect(obsNode.getControlType()).toBe("autocomplete");
        });
    });

    describe("PrimaryObs", function() {
        it("should return obs which is not Abnormal Obs or Duration", function() {
            var obsNode = mapper.map(savedObs, rootConcept, {"Chief Complaint": {freeTextAutocomplete: true}});
            expect(obsNode.getPrimaryObs().concept.uuid).toEqual(chiefComplaint.uuid);
            expect(obsNode.getAbnormalObs().concept.uuid).toEqual(abnormal.uuid);
            expect(obsNode.getDurationObs().concept.uuid).toEqual(duration.uuid);
        });

        it("isComputed to be true if primaryObs is computed", function() {
            var obsNode = mapper.map(savedObs, rootConcept, {"Chief Complaint": {freeTextAutocomplete: true}});
            expect(obsNode.isComputed()).toBeTruthy();
        });
    });

    function buildConcept(name, setMembers, answers, classname, datatype) {
        return {
            "name": {name: name},
            "set": setMembers && setMembers.length > 0,
            conceptClass: {name: classname || "N/A"},
            dataType: datatype || "Text",
            setMembers: setMembers,
            answers: answers,
            "uuid": name + "_uuid"
        }
    }
});
