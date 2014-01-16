'use strict';

angular.module('opd.consultation.controllers')
    .controller('VisitController', ['$rootScope', '$scope', 'encounterService', 'visitService','$route', 'spinner','$routeParams',
        function ($rootScope, $scope, encounterService, visitService, $route, spinner,$routeParams) {

    $scope.visitUuid = $route.current.params.visitUuid;


}]);
