'use strict';

angular.module('bahmni.common.visit')
    .directive('visitSummary', ['$rootScope', 'encounterService', 'visitService','$route', 'spinner','$routeParams', function ($rootScope, encounterService, visitService, $route, spinner,$routeParams) {
        return {
            restrict: 'E',
            templateUrl: '../common/modules/visit/views/visitDaySummary.html',
            scope: {
                visitUuid: '='
            },
            link: function ($scope, elem, attr) {
                $scope.visitDays = [];
                $scope.hasMoreVisitDays;
                $scope.patientUuid = $routeParams.patientUuid;
                var currentEncounterDate;
                var loading;
                var DateUtil = Bahmni.Common.Util.DateUtil;

                var showVisit = function() {
                    if($scope.visitUuid == null) {
                        return;
                    }
                    $scope.visitDays = [];
                    return visitService.getVisitSummary($scope.visitUuid).success(function (encounterTransactions) {
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
                    encounterService.search($scope.visitUuid, encounterDate.toISOString().substring(0, 10)).success(function(encounterTransactions){
                        var dayNumber = DateUtil.getDayNumber($scope.visitSummary.visitStartDateTime, encounterDate);
                        var visitDay = Bahmni.Opd.Consultation.VisitDay.create(dayNumber, encounterDate, encounterTransactions, $rootScope.consultationNoteConcept, $rootScope.encounterConfig.orderTypes);
                        $scope.visitDays.push(visitDay);
                    }).then(markLoadingDone, markLoadingDone);
                    currentEncounterDate = encounterDate;
                    $scope.hasMoreVisitDays = currentEncounterDate > $scope.visitSummary.visitStartDateTime;
                }

                $scope.$watch('visitUuid', showVisit);

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
            }
        }
    }]);