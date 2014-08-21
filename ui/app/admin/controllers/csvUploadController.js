'use strict';

angular.module('admin')
    .controller('CSVUploadController', ['$scope', '$rootScope', 'FileUploader', 'appService',
        function ($scope, $rootScope, FileUploader, appService) {
            var adminCSVExtension = appService.getAppDescriptor().getExtension("bahmni.admin.csv");
            $scope.algorithmFileNames = adminCSVExtension.extensionParams.algorithmFileNames;
            $scope.uploader = new FileUploader({
                url: '/openmrs/ws/rest/v1/bahmnicore/admin/upload/encounter',
                formData: [{patientMatchingAlgorithm: null}]
            });


        }]);