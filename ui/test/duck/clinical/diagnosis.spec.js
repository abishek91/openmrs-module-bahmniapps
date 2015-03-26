describe("Diagnosis page",function() {
    var setup;

    beforeEach(function($provide){
        console.log("before");
        var controllerDependencies = {
            diagnosisService : {} ,
            contextChangeHandler: {add : function() {}},
            spinner: {},
            $scope: {consultation: {saveHandler : {register: function(){}}, postSaveHandler: {register: function() {}}, newlyAddedDiagnoses: [] }}
        };

        var configModule = angular.module('bahmni.common.config', [])
        //var domainModule = angular.module('bahmni.common.domain', [])
        var conceptSetModule = angular.module('bahmni.common.conceptSet', [])
        var uiHelperModule = angular.module('bahmni.common.uiHelper', [])
        var galleryModule = angular.module('bahmni.common.gallery', [])
        var loggingModule = angular.module('bahmni.common.logging', [])

        var appLevelDependencies = {'bahmni.common.config' : configModule,
                                //'bahmni.common.domain': domainModule,
                                'bahmni.common.conceptSet': conceptSetModule,
                                'bahmni.common.uiHelper': uiHelperModule,
                                'bahmni.common.gallery': galleryModule,
                                'bahmni.common.logging': loggingModule};

        setup = setupDuckForClinical("DiagnosisController", "app/clinical/consultation/views/diagnosis.html", appLevelDependencies,
            controllerDependencies);
        console.log("after");

    })


  it("can show items not to do", function() {
     return setup.spread(function(dom) {
       console.log("hello");
     });
  });
})