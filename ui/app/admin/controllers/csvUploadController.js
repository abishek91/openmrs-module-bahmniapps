'use strict';

angular.module('bahmni.admin')
    .controller('CSVUploadController', ['$scope', '$rootScope', 'FileUploader', 'appService', 'adminImportService',
        function ($scope, $rootScope, FileUploader, appService, adminImportService) {
            var adminCSVExtension = appService.getAppDescriptor().getExtension("bahmni.admin.csv");
            var patientMatchingAlgorithm = adminCSVExtension.extensionParams.patientMatchingAlgorithm || "";
            var fileUploaderOptions = {
                url: Bahmni.Common.Constants.encounterImportUrl,
                formData: [
                    {patientMatchingAlgorithm: patientMatchingAlgorithm}
                ]
            };
            $scope.uploader = new FileUploader(fileUploaderOptions);

            adminImportService.getAllStatus().then(function(response){
                $scope.importedItems = response.data;
            });
        }]);