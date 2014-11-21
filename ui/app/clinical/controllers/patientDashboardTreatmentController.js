angular.module('bahmni.clinical')
    .controller('PatientDashboardTreatmentController', ['$q', '$scope', '$stateParams', 'TreatmentService', 'spinner', function ($q, $scope, $stateParams, treatmentService, spinner) {
        $scope.drugOrderSections = {
            "active": {displayName: "Active Prescription", orders: null},
            "past": {displayName: "Last Prescription", orders: null}
        };

        var getActiveDrugOrders = function() {
            return treatmentService.getActiveDrugOrders($stateParams.patientUuid).then(function (drugOrders) {
                $scope.drugOrderSections.active.orders = drugOrders.map(Bahmni.Clinical.DrugOrderViewModel.createFromContract);
            });
        };

        var getLastPrescribedDrugOrders = function() {
            var numberOfVisits = $scope.section.numberOfVisits || 1;
            return treatmentService.getPrescribedDrugOrders($stateParams.patientUuid, false, numberOfVisits).then(function (drugOrders) {
                $scope.drugOrderSections.past.orders = drugOrders.map(Bahmni.Clinical.DrugOrderViewModel.createFromContract);
            });
        };

        spinner.forPromise($q.all([getActiveDrugOrders(), getLastPrescribedDrugOrders()]));

    }]).controller('PatientDashboardAllTreatmentController', ['$scope', '$stateParams', 'TreatmentService', 'spinner', function($scope, $stateParams, treatmentService, spinner) {
        var init = function(){
            return treatmentService.getPrescribedDrugOrders($stateParams.patientUuid, true).then(function(drugOrders){
                var dateUtil = Bahmni.Common.Util.DateUtil;
                var prescribedDrugOrders = [];
                drugOrders.forEach(function(drugOrder){
                    prescribedDrugOrders.push(Bahmni.Clinical.DrugOrderViewModel.createFromContract(drugOrder))
                });
                $scope.allTreatments = new Bahmni.Clinical.ResultGrouper().group(prescribedDrugOrders, function(prescribedDrugOrder){
                    return dateUtil.getDate(prescribedDrugOrder.effectiveStartDate);
                });
            });
        };

        spinner.forPromise(init());
    }]);
