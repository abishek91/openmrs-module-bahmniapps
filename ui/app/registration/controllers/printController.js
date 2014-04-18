'use strict';

angular.module('bahmni.registration')
    .controller('PrintController', ['$scope', '$routeParams', 'spinner', 'patientService', 'openmrsPatientMapper', 'appService', '$sce',
     function ($scope, $routeParams, spinner, patientService, openmrsPatientMapper, appService, $sce) {
        var patientUuid = $routeParams.patientUuid;
        var printLayoutFile = appService.getAppDescriptor().getConfigValue("registrationCardLayout");
        $scope.patient = {};
        (function () {
            var getPatientPromise = patientService.get(patientUuid).success(function (openmrsPatient) {
                $scope.patient = openmrsPatientMapper.map(openmrsPatient);
                $scope.patient.isNew = $routeParams.newpatient;
                appService.getLayout(printLayoutFile).then(function(layout){
                        $scope.layout = $sce.trustAsHtml(layout);
                });
            });
            spinner.forPromise(getPatientPromise);
        })();
    }]);
