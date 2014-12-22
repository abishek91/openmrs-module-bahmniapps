angular.module('bahmni.clinical')
    .controller('PatientDashboardTreatmentController', ['$q', '$rootScope', '$scope', '$stateParams', 'TreatmentService', 'spinner', 'clinicalConfigService', function ($q, $rootScope, $scope, $stateParams, treatmentService, spinner, clinicalConfigService) {
        $scope.drugOrderSections = {
            "active": {displayName: "Active / Scheduled Prescription", orders: null},
            "past": {displayName: "Last Prescription", orders: null}
        };

        var isActiveNeeded = clinicalConfigService.getPatientDashBoardSectionByName("treatment").active;

        var dateCompare = function (drugOrder1, drugOrder2) {
            return drugOrder1.effectiveStartDate > drugOrder2.effectiveStartDate ? -1 : 1;
        };
        var mapToPrecribedDrugOrder = function(drugOrder) {
            return Bahmni.Clinical.DrugOrderViewModel.createFromContract(drugOrder, null, null, $rootScope.retrospectiveEntry.encounterDate);
        }
        var getActiveDrugOrders = function () {
            return treatmentService.getActiveDrugOrders($stateParams.patientUuid).then(function (drugOrders) {
                var prescribedDrugOrders = drugOrders.map(mapToPrecribedDrugOrder);
                $scope.drugOrderSections.active.orders = prescribedDrugOrders.sort(dateCompare);
            });
        };

        var mapToPrecribedDrugOrder = function(drugOrder) {
            return Bahmni.Clinical.DrugOrderViewModel.createFromContract(drugOrder, null, null, $rootScope.retrospectiveEntry.encounterDate);
        }

        var getLastPrescribedDrugOrders = function () {
            var numberOfVisits = $scope.section.numberOfVisits || 1;
            return treatmentService.getPrescribedDrugOrders($stateParams.patientUuid, false, numberOfVisits).then(function (drugOrders) {
                var prescribedDrugOrders = drugOrders.map(mapToPrecribedDrugOrder);
                $scope.drugOrderSections.past.orders = prescribedDrugOrders.sort(dateCompare);
            });
        };

        $scope.isSectionNeeded = function (key) {
            if (key !== "active") return true;
            return isActiveNeeded;
        };

        var getPromises = function () {
            var promises = [getLastPrescribedDrugOrders()];
            if (isActiveNeeded) {
                promises.push(getActiveDrugOrders());
            }
            return promises;
        };

        spinner.forPromise($q.all(getPromises()));
    }]).controller('PatientDashboardAllTreatmentController', ['$scope', '$stateParams', 'TreatmentService', 'spinner', function ($scope, $stateParams, treatmentService, spinner) {
        var init = function () {
            return treatmentService.getPrescribedDrugOrders($stateParams.patientUuid, true).then(function (drugOrders) {
                var dateUtil = Bahmni.Common.Util.DateUtil;
                var prescribedDrugOrders = [];
                drugOrders.forEach(function (drugOrder) {
                    prescribedDrugOrders.push(Bahmni.Clinical.DrugOrderViewModel.createFromContract(drugOrder, null, null, $rootScope.retrospectiveEntry.encounterDate))
                });
                $scope.allTreatments = new Bahmni.Clinical.ResultGrouper().group(prescribedDrugOrders, function (prescribedDrugOrder) {
                    return dateUtil.getDate(prescribedDrugOrder.effectiveStartDate).toISOString();
                });
                $scope.allTreatments = _.sortBy($scope.allTreatments, 'key').reverse();
            });
        };

        spinner.forPromise(init());
    }]);
