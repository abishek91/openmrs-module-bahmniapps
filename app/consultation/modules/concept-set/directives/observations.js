'use strict';

angular.module('opd.conceptSet')
    .directive('showObservation', [function () {
        return {
            restrict: 'E',
            scope: {
                obs: "=",
                emptyObsCheck: "@"
            },
            template: '<ng-include src="\'modules/concept-set/views/observation.html\'" />'
        }
    }]);

