describe("LabOrderResultService", function() {
    var rootScope;
    var mockHttp;
    var LabOrderResultService;
    beforeEach(module('bahmni.clinical'));

    var labOrderResults = {
        "results":[
            {"accessionUuid": "uuid1", "accessionDateTime":1401437955000, "testName": "ZN Stain(Sputum)"},
            {"accessionUuid": "uuid1", "accessionDateTime":1401437955000, "testName": "Gram Stain(Sputum)"},
            {"accessionUuid": "uuid1", "accessionDateTime":1401437955000, "testName": "Haemoglobin", "panelName": "Routine Blood"},
            {"accessionUuid": "uuid1", "accessionDateTime":1401437955000, "testName": "ESR", "panelName": "Routine Blood"},
            {"accessionUuid": "uuid2", "accessionDateTime":1401437956000, "testName": "ZN Stain(Sputum)"},
        ], "tabularResult": {
            "values":[
                {"testOrderIndex":0,"dateIndex":0,"abnormal":false,"result":"25.0"},
            ], "orders":[
                {"minNormal":0.0,"maxNormal":6.0,"testName":"ZN Stain(Sputum)","testUnitOfMeasurement":"%","index":0}
            ], "dates":[
                {"index":0,"date":"30-May-2014"}
            ]
        }
    }

    beforeEach(module(function ($provide) {
        mockHttp = jasmine.createSpyObj('$http', ['get']);
        mockHttp.get.and.callFake(function(param) {
            return specUtil.respondWith({"data": labOrderResults});
        });
        $provide.value('$http', mockHttp);
        $provide.value('$q', Q);
    }));

    beforeEach(inject(['LabOrderResultService', function (LabOrderResultServiceInjected) {
        LabOrderResultService = LabOrderResultServiceInjected;
    }]));

    describe("getAllForPatient", function(){
        it("should fetch all Lab orders & results and group by accessions", function(done){
            LabOrderResultService.getAllForPatient("123").then(function(results) {
                expect(mockHttp.get.calls.mostRecent().args[1].params.patientUuid).toBe("123");
                expect(results.accessions.length).toBe(2);
                expect(results.accessions[0].length).toBe(1);
                expect(results.accessions[1].length).toBe(3);
                done();
            });
        });

        it("should sort by accession date and group by panel", function(done){
            LabOrderResultService.getAllForPatient("123").then(function(results) {
                expect(mockHttp.get.calls.mostRecent().args[1].params.patientUuid).toBe("123");
                expect(results.accessions[0][0].accessionUuid).toBe("uuid2");
                expect(results.accessions[1][0].accessionUuid).toBe("uuid1");
                done();
            });
        });

        it("should group accessions by panel", function(done){
            LabOrderResultService.getAllForPatient("123").then(function(results) {
                expect(mockHttp.get.calls.mostRecent().args[1].params.patientUuid).toBe("123");

                expect(results.accessions[1][0].isPanel).toBeFalsy();
                expect(results.accessions[1][0].orderName).toBe("ZN Stain(Sputum)");
                expect(results.accessions[1][1].orderName).toBe("Gram Stain(Sputum)");
                expect(results.accessions[1][2].isPanel).toBeTruthy();
                expect(results.accessions[1][2].orderName).toBe("Routine Blood");
                expect(results.accessions[1][2].tests.length).toBe(2);
                done();
            });
        });

        iit("should work", function() {
            var output = ourNiceAlgo(labOrders.results);
            //console.log(JSON.stringify(output, null, 2));

        });

        var labOrders = {
            "results": [
                {
                    "testName": "RBC (Urine)",
                    "panelName": null,
                    "uploadedFileName": null,
                    "minNormal": null,
                    "maxNormal": null,
                    "abnormal": true,
                    "notes": null,
                    "accessionNotes": null,
                    "accessionUuid": "4ac66a80-9324-4624-8e00-ce129f9ac31e",
                    "testUuid": "83e667f0-6c06-466d-8616-1d633e81bdbf",
                    "resultDateTime": 1418360292000,
                    "referredOut": false,
                    "accessionDateTime": 1418360147000,
                    "testUnitOfMeasurement": null,
                    "panelUuid": null,
                    "visitStartTime": 1418360147000,
                    "result": "asdasdf",
                    "provider": "admin"
                },
                {
                    "testName": "MCHC",
                    "panelName": "Anaemia Panel",
                    "uploadedFileName": null,
                    "minNormal": null,
                    "maxNormal": null,
                    "abnormal": null,
                    "notes": null,
                    "accessionNotes": null,
                    "accessionUuid": "4ac66a80-9334-4624-8e00-ce129f9ac31e",
                    "testUuid": "be63d7e2-7ce7-4a20-9c67-81d5f7c45f3e",
                    "resultDateTime": 1418360147000,
                    "referredOut": true,
                    "accessionDateTime": 1418360147000,
                    "testUnitOfMeasurement": null,
                    "panelUuid": "98e4000d-f400-474b-83c0-0ac2981ec5aa",
                    "visitStartTime": 1418360147000,
                    "result": null,
                    "provider": "Lab System"
                },
                {
                    "testName": "Platelet Count",
                    "panelName": "Anaemia Panel",
                    "uploadedFileName": null,
                    "minNormal": 100000,
                    "maxNormal": 300000,
                    "abnormal": true,
                    "notes": null,
                    "accessionNotes": null,
                    "accessionUuid": "4ac66a80-9334-4624-8e00-ce129f9ac31e",
                    "testUuid": "5acb5d37-ca4a-4b62-9f30-4eaca8f0e875",
                    "resultDateTime": 1418360292000,
                    "referredOut": false,
                    "accessionDateTime": 1418360147000,
                    "testUnitOfMeasurement": null,
                    "panelUuid": "98e4000d-f400-474b-83c0-0ac2981ec5aa",
                    "visitStartTime": 1418360147000,
                    "result": "1.1111111E7",
                    "provider": "admin"
                },
                {
                    "testName": "MCH",
                    "panelName": "Anaemia Panel",
                    "uploadedFileName": null,
                    "minNormal": 28,
                    "maxNormal": 31,
                    "abnormal": false,
                    "notes": null,
                    "accessionNotes": null,
                    "accessionUuid": "4ac66a80-9334-4624-8e00-ce129f9ac31e",
                    "testUuid": "330d82fa-f0e7-4b30-a766-a63cf5604d5b",
                    "resultDateTime": 1418360292000,
                    "referredOut": false,
                    "accessionDateTime": 1418360147000,
                    "testUnitOfMeasurement": null,
                    "panelUuid": "98e4000d-f400-474b-83c0-0ac2981ec5aa",
                    "visitStartTime": 1418360147000,
                    "result": "28.0",
                    "provider": "admin"
                },
                {
                    "testName": "Sickling Test",
                    "panelName": "Anaemia Panel",
                    "uploadedFileName": null,
                    "minNormal": null,
                    "maxNormal": null,
                    "abnormal": false,
                    "notes": null,
                    "accessionNotes": null,
                    "accessionUuid": "4ac66a80-9334-4624-8e00-ce129f9ac31e",
                    "testUuid": "cacbc625-c734-404d-b123-882debb67fb0",
                    "resultDateTime": 1418360292000,
                    "referredOut": false,
                    "accessionDateTime": 1418360147000,
                    "testUnitOfMeasurement": null,
                    "panelUuid": "98e4000d-f400-474b-83c0-0ac2981ec5aa",
                    "visitStartTime": 1418360147000,
                    "result": "Negative",
                    "provider": "admin"
                },
                {
                    "testName": "Absolute Eosinphil Count",
                    "panelName": "Anaemia Panel",
                    "uploadedFileName": null,
                    "minNormal": 100,
                    "maxNormal": 600,
                    "abnormal": false,
                    "notes": null,
                    "accessionNotes": null,
                    "accessionUuid": "4ac66a80-9334-4624-8e00-ce129f9ac31e",
                    "testUuid": "ab137c0f-5a23-4314-ab8d-29b8ff91fbfb",
                    "resultDateTime": 1418360292000,
                    "referredOut": false,
                    "accessionDateTime": 1418360147000,
                    "testUnitOfMeasurement": null,
                    "panelUuid": "98e4000d-f400-474b-83c0-0ac2981ec5aa",
                    "visitStartTime": 1418360147000,
                    "result": "100.0",
                    "provider": "admin"
                },
                {
                    "testName": "Hb Electrophoresis",
                    "panelName": "Anaemia Panel",
                    "uploadedFileName": null,
                    "minNormal": null,
                    "maxNormal": null,
                    "abnormal": false,
                    "notes": null,
                    "accessionNotes": null,
                    "accessionUuid": "4ac66a80-9334-4624-8e00-ce129f9ac31e",
                    "testUuid": "79b4cc56-84c6-49db-81e4-33b79e24bcbb",
                    "resultDateTime": 1418360292000,
                    "referredOut": false,
                    "accessionDateTime": 1418360147000,
                    "testUnitOfMeasurement": null,
                    "panelUuid": null,
                    "visitStartTime": 1418360147000,
                    "result": "AA",
                    "provider": "admin"
                }
            ]};

    });
});