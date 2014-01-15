'use strict';

angular.module('opd.patientDashboard',[])
    .controller('PatientDashboardController', ['$scope', '$rootScope', '$location', '$routeParams', 'patientVisitHistoryService', 'urlHelper', 'visitService', 'encounterService', function($scope, $rootScope, $location, $routeParams, patientVisitHistoryService, urlHelper, visitService, encounterService) {
        $scope.patientUuid = $routeParams.patientUuid;
        var currentEncounterDate;
        var loading;
        var DateUtil = Bahmni.Common.Util.DateUtil;

        patientVisitHistoryService.getVisits($scope.patientUuid).then(function(visits) {
            $scope.visits = visits.map(function(visitData){ return new Bahmni.Opd.Consultation.VisitHistoryEntry(visitData) });
            $scope.activeVisit = $scope.visits.filter(function(visit) {return visit.isActive()})[0];
            $scope.selectedVisit = $scope.visits[0];
            $scope.visitUuid=$scope.selectedVisit.uuid;
            console.log($scope.selectedVisit);
        });

        $scope.showVisitSummary = function(visit) {
            $scope.selectedVisit = visit;
            $scope.visitUuid=$scope.selectedVisit.uuid;
        }

        $scope.getConsultationPadLink = function() {
            if($scope.activeVisit) {
                return urlHelper.getVisitUrl($scope.activeVisit.uuid);
            } else {
                return urlHelper.getConsultationUrl();
            }
        }

        $scope.isCurrentVisit = function(visit) {
            return visit.uuid === $scope.selectedVisit.uuid;
        }

    }]);