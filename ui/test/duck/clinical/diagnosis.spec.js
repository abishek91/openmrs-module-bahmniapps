describe("Diagnosis page",function() {
    var setup;

    beforeEach(function(){
        console.log("before");
        var controllerDependencies = {
            diagnosisService : {} ,
            contextChangeHandler: {add : function() {}},
            spinner: {},
            $scope: {consultation: {saveHandler : {register: function(){}}, postSaveHandler: {register: function() {}}, newlyAddedDiagnoses: [] }}
        };

        var appLevelDependencies = {
            
        }
        setup = setupDuckForClinical("DiagnosisController", "app/clinical/consultation/views/diagnosis.html", {}, controllerDependencies);
        console.log("after");

    })


  it("can show items not to do", function() {
     return setup.spread(function(dom) {
       console.log("hello");
     });
  });
})