'use strict';

angular.module('opd.conceptSet.controllers')
    /*.controller('ConceptSetController', ['$scope', '$rootScope','$route', 'ConceptSetService', function ($scope, $rootScope,$route, conceptSetService) {


    }]).*/
    .directive('showConcept',['$rootScope',function(rootScope){
        var getObsValueReference = function(conceptReference){
            return "conceptObsMap["+conceptReference+".uuid].value";
        }


        return {
            restrict: 'E',
            scope :{
                conceptObsMap : "=",
                displayType:"@",
                concept:"=",
                emptyObsCheck:"@"
            },
            template :
                '<div ng-switch on="concept.set" >' +
                    '<div class="form-field" ng-switch-when="false" ng-hide="emptyObsCheck && !'+getObsValueReference("concept")+'">' +
                        '<div class="field-attribute"><label>{{concept.display}}</label><span class="label-add-on" ng-show="concept.units">({{concept.units}})</span></div>' +
                        '<div class="field-value" ng-switch on="displayType">' +
                            '<span ng-switch-when="readonly" class="value-text-only">{{'+getObsValueReference("concept")+'}}</span>'+
                            '<input ng-switch-default type="text" placeholder="{{concept.display}}" ng-model="'+getObsValueReference("concept")+'"></input>' +
                        '</div>'+
                    '</div>'+
                    '<fieldset ng-switch-when="true"><div class="form-field">' +
                        '<div class="form-field form-field-group" ng-repeat="childConcept in concept.setMembers" ng-hide="emptyObsCheck && !'+getObsValueReference("childConcept")+'">' +
                            '<div ng-switch on="$index" ><legend ng-switch-when="0" class="mylegend" ><strong>{{concept.display}}</strong></legend></div>'+
                            '<div class="field-attribute"><label>{{childConcept.display}}</label><span ng-show="concept.units">({{concept.units}})</span>'+'</div>' +
                            '<div  class="field-value" ng-switch on="displayType">' +
                                '<span ng-switch-when="readonly" class="value-text-only">{{'+getObsValueReference("childConcept")+'}}</span>'+
                                '<input ng-switch-default type="text" placeholder="{{childConcept.display}}" ng-model="'+getObsValueReference("childConcept")+'"></input>' +
                            '</div>'+
                        '</div>'+
                    '</div></fieldset>' +
                '</div>'
        }
    }]).directive('showConceptSet',['$rootScope',function(rootScope){
            var template =
            '<form ng-init="getConceptSet(\'VITALS_CONCEPT\')">'+
                '<div  ng-repeat="concept in conceptSet" >'+
                    '<show-concept concept-obs-map="$parent.conceptToObservationMap" concept="concept" ></show-concept>'+
                '</div>' +
            '</form>' ;

            var name = 'VITALS_CONCEPT';
            var controller = function($scope,ConceptSetService){
            rootScope[name] = rootScope[name] || {}

            if(!rootScope[name].conceptSet){
                $scope.getConceptSet = function (name) {
                    console.log("in get concept set");
                    ConceptSetService.getConceptSetMembers(name).success(function(response){
                        if(response.results && response.results.length > 0){
                            rootScope[name].conceptSet = response.results[0].setMembers;
                            rootScope[name].conceptToObservationMap = new Bahmni.Opd.ObservationMapper(rootScope.encounterConfig)
                                .map(rootScope.visit, rootScope[name].conceptSet);
                        }
                    })
                }
            }

            var constructObsList = function(){
                var obsList = [];
                for(var conceptUuid in rootScope[name].conceptToObservationMap){
                    obsList.push(rootScope[name].conceptToObservationMap[conceptUuid]);
                }
                return obsList;
            }

            $scope.getObsForConceptUuid = function(conceptUuid){
                if(rootScope[name].conceptToObservationMap) {
                    return  rootScope[name].conceptToObservationMap[conceptUuid];
                }
                return {};
            }

            /*$scope.$on('$destroy', function() {
                console.log($rootScope.vitals);
                $rootScope.vitals.recordedVitals = constructObsList();
            });*/
        }

        return {
            restrict: 'E',
            scope :{
                displayType:"@",
                emptyObsCheck:"@",
                conceptSetName:"@"
            },
            template :template,
            controller : controller

        }
    }])

