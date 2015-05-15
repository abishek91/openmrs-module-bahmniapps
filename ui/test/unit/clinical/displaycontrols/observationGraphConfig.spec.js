'use strict';

describe("observationGraphConfig", function () {

    it("should create the config object", function () {
        var config = {
            "yAxisConcepts": ["Systolic", "Diastolic"],
            "xAxisConcept": "observationDateTime"
        };
        expect(new Bahmni.Clinical.ObservationGraphConfig(config).yAxisConcepts).toEqual(["Systolic", "Diastolic"])
    });

    it("should create the config object for growth chart", function () {
        var config = {
            "growthChart": {
                "referenceData": "growthChartReference.csv"
            },
            "numberOfVisits": 20
        }
        var graphConfig = new Bahmni.Clinical.ObservationGraphConfig(config);
        expect(graphConfig.yAxisConcepts).toEqual(["WEIGHT"]);
        expect(graphConfig.xAxisConcept).toEqual("AGE");
    });

});