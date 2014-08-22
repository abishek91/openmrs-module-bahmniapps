'use strict';

angular.module('admin')
    .controller('CSVUploadController', ['$scope', '$rootScope', 'FileUploader', 'appService',
        function ($scope, $rootScope, FileUploader, appService) {
            var adminCSVExtension = appService.getAppDescriptor().getExtension("bahmni.admin.csv");
            var patientMatchingAlgorithm = adminCSVExtension.extensionParams.patientMatchingAlgorithm || "";
            var fileUploaderOptions = {
                url: Bahmni.Common.Constants.encounterImportUrl,
                formData: [
                    {patientMatchingAlgorithm: patientMatchingAlgorithm}
                ]
            };
            $scope.uploader = new FileUploader(fileUploaderOptions);
        }]);