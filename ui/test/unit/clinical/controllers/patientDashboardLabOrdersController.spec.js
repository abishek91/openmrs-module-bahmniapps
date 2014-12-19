'use strict';

describe("PatientDashboardLabOrdersController", function(){

    beforeEach(module('bahmni.clinical'));

    var scope;
    var stateParams;
    var _clinicalConfigService;
    var labResultSection = {
            "title": "Lab Results",
            "name": "labOrders",
            "showNormalValues":false
        };


    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();

        _clinicalConfigService = jasmine.createSpyObj('clinicalConfigService', ['getPatientDashBoardSectionByName']);
        _clinicalConfigService.getPatientDashBoardSectionByName.and.returnValue(labResultSection);

        stateParams = {
            patientUuid: "some uuid"
        };

        $controller('PatientDashboardLabOrdersController', {
            $scope: scope,
            $stateParams: stateParams,
            clinicalConfigService: _clinicalConfigService
        });
    }));

    describe("when initialized", function(){
        it("creates configuration for displaying lab order display parameters", function() {
            var params = scope.labOrderControlParameters;
            expect(params.patientUuid).toBe("some uuid");
            expect(params.showNormalValues).toBe(labResultSection.showNormalValues);
        });
    });
});