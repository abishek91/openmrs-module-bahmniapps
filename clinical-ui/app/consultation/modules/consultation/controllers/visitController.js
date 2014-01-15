'use strict';

angular.module('opd.consultation.controllers')
    .controller('VisitController', ['$rootScope', '$scope', 'encounterService', 'visitService','$route', 'spinner','$routeParams',
        function ($rootScope, $scope, encounterService, visitService, $route, spinner,$routeParams) {
	$scope.visitDays = [];
    $scope.hasMoreVisitDays;
    $scope.patientUuid = $routeParams.patientUuid;
    var currentEncounterDate;
    var loading;
    var DateUtil = Bahmni.Common.Util.DateUtil;

    var visitUuid = $rootScope.visitUuid || $route.current.params.visitUuid;


    var getVisitSummary = function(visitUuid) {
        $scope.visitDays = [];
        $scope.hasMoreVisitDays;
        console.log(visitUuid);
        return visitService.getVisitSummary(visitUuid).success(function (encounterTransactions) {
            $scope.visitSummary = Bahmni.Opd.Consultation.VisitSummary.create(encounterTransactions);
            if($scope.visitSummary.hasEncounters()) {
                loadEncounters($scope.visitSummary.mostRecentEncounterDateTime);
            }
        });
    }

    var markLoadingDone = function() {
        loading = false;
    }

    var loadEncounters = function(encounterDate) {
    	if(loading) return;
        loading = true;
        encounterService.search(visitUuid, encounterDate.toISOString().substring(0, 10)).success(function(encounterTransactions){
            var dayNumber = DateUtil.getDayNumber($scope.visitSummary.visitStartDateTime, encounterDate);
            var visitDay = Bahmni.Opd.Consultation.VisitDay.create(dayNumber, encounterDate, encounterTransactions, $scope.consultationNoteConcept, $scope.encounterConfig.orderTypes);
            $scope.visitDays.push(visitDay);
	    }).then(markLoadingDone, markLoadingDone);
    	currentEncounterDate = encounterDate;
        $scope.hasMoreVisitDays = currentEncounterDate > $scope.visitSummary.visitStartDateTime;
    }

    console.log(visitUuid);
    spinner.forPromise(getVisitSummary(visitUuid));

    $rootScope.$watch('visitUuid', function() {
        visitUuid = $rootScope.visitUuid || $route.current.params.visitUuid;
        console.log(visitUuid);
        getVisitSummary(visitUuid);
    });

    $scope.loadEncountersForPreviousDay = function() {    	
        if($scope.hasMoreVisitDays) {
            var previousDate = new Date(currentEncounterDate.valueOf() - 60 * 1000 * 60 * 24);
            loadEncounters(previousDate)            
        } 
    };


    $scope.isNumeric = function(value){
        return $.isNumeric(value);
    }

    $scope.toggle = function(item) {
        item.show = !item.show
    }

}]);
