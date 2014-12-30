'use strict';

angular.module('bahmni.clinical')
  .service('patientVisitHistoryService', ['visitService', '$q', function (visitService, $q) {
    var patientVisitsMap = {};
    
    this.getVisits = function(patientUuid) {    	
    	var deferred = $q.defer();
        if(patientVisitsMap[patientUuid]){
            deferred.resolve(patientVisitsMap[patientUuid]);
        }
        else {
    	   visitService.search({patient: patientUuid, v: 'custom:(uuid,startDatetime,stopDatetime,encounters:(uuid))', includeInactive: true}).success(function(data){
                patientVisitsMap[patientUuid] = data.results;
                deferred.resolve(patientVisitsMap[patientUuid]);                
	       }).error(deferred.reject);
       }
	    return deferred.promise;
    }
}]);