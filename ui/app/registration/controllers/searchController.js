'use strict';

angular.module('bahmni.registration')
    .controller('SearchPatientController', ['$rootScope', '$scope', '$location', '$window', 'spinner', 'patientService', 'appService', 'Preferences',
        function ($rootScope, $scope, $location, $window, spinner, patientService, appService, preferences) {
            $scope.identifierSources = $rootScope.patientConfiguration.identifierSources;
            $scope.results = [];
            var searching = false;

            var hasSearchParameters = function () {
                return $scope.searchParameters.name.trim().length > 0
                    || $scope.searchParameters.village.trim().length > 0
                    || $scope.searchParameters.localName.trim().length > 0;
            };

            var searchBasedOnQueryParameters = function (offset) {
                $scope.searchParameters.village = $location.search().village || '';
                $scope.searchParameters.name = $location.search().name || '';
                $scope.searchParameters.localName = $location.search().localName || '';
                var identifierPrefix = $location.search().identifierPrefix;
                if (!identifierPrefix || identifierPrefix.length === 0) {
                    identifierPrefix = preferences.identifierPrefix;
                }
                $scope.identifierSources.forEach(function (identifierSource) {
                    if (identifierPrefix === identifierSource.prefix) {
                        $scope.identifierSource = identifierSource;
                    }
                });
                $scope.identifierSource = $scope.identifierSource || $scope.identifierSources[0];

                $scope.registrationNumber = $location.search().registrationNumber || "";
                if (hasSearchParameters()) {
                    var searchPromise = patientService.search(
                        $scope.searchParameters.name, $scope.searchParameters.village, $scope.searchParameters.localName, offset, $scope.localNameAttributes);
                    searching = true;
                    searchPromise['finally'](function () {
                        searching = false;
                    });
                    return searchPromise;
                }
            };

            var mapLocalName = function(data){
                if($scope.localNameAttributes){
                    data.results.map(function(result){
                        if(result.localName){
                            result.localName.split(" ").forEach(
                                function(name){
                                    var parts = name.split(":");
                                    result[parts[0]] = parts[1];
                                });
                            $scope.localNameAttributes.forEach(function(attribute){
                                result.localNameDisplay = result.localNameDisplay
                                    ? result.localNameDisplay + " " + (result[attribute] || "") : result[attribute];
                            });
                        }
                    });
                }
            };

            var showSearchResults = function (searchPromise) {
                $scope.noMoreResultsPresent = false;
                if (searchPromise) {
                    searchPromise.success(function (data) {
                        mapLocalName(data);
                        $scope.results = data.pageOfResults;
                        $scope.noResultsMessage = $scope.results.length === 0 ? "No results found" : null;
                    });
                }
            };

            var setLocalNameSearchAttributes = function () {
                $scope.localNameAttributes = appService.getAppDescriptor().getConfigValue("localNameAttributesToDisplay");
                $scope.showLocalNameSearch = appService.getAppDescriptor().getConfigValue("localNameSearch") || false;
                $scope.localNameSearchLabel = appService.getAppDescriptor().getConfigValue("localNameLabel") || false;
                $scope.localNameSearchPlaceholder = appService.getAppDescriptor().getConfigValue("localNamePlaceholder") || false;
                if (!$scope.localNameAttributes) {
                    $scope.showLocalNameSearch = false;
                }
            };

            var initialize = function () {
                $scope.searchParameters = {};
                $scope.searchActions = appService.getAppDescriptor().getExtensions("org.bahmni.registration.patient.search.result.action");

                setLocalNameSearchAttributes();
            };

            var identifyParams = function (querystring) {
                querystring = querystring.substring(querystring.indexOf('?') + 1).split('&');
                var params = {}, pair, d = decodeURIComponent;
                for (var i = querystring.length - 1; i >= 0; i--) {
                    pair = querystring[i].split('=');
                    params[d(pair[0])] = d(pair[1]);
                }
                return params;
            };

            initialize();

            $scope.disableSearchButton = function () {
                return !$scope.searchParameters.name && !$scope.searchParameters.village && !$scope.searchParameters.localName;
            };

            $scope.$watch(function () {
                return $location.search();
            }, function () {
                showSearchResults(searchBasedOnQueryParameters(0))
            });

            $scope.searchById = function () {
                if (!$scope.registrationNumber) return;
                $scope.results = [];
                var patientIdentifier = $scope.identifierSource.prefix + $scope.registrationNumber;
                preferences.identifierPrefix = $scope.identifierSource.prefix;
                $location.search({identifierPrefix: $scope.identifierSource.prefix, registrationNumber: $scope.registrationNumber});
                var searchPromise = patientService.search(patientIdentifier).success(function (data) {
                    mapLocalName(data);
                    if (data.pageOfResults.length === 1) {
                        var patient = data.pageOfResults[0];
                        var forwardUrl = appService.getAppDescriptor().getConfigValue("searchByIdForwardUrl") || "/patient/{{patientUuid}}";
                        $location.url(appService.getAppDescriptor().formatUrl(forwardUrl, {'patientUuid': patient.uuid}));
                    } else if (data.pageOfResults.length > 1) {
                        $scope.results = data.pageOfResults;
                    } else {
                        $scope.noResultsMessage = "Could not find patient with identifier " + patientIdentifier + ". Please verify the patient ID entered or create a new patient record with this ID."
                    }
                });
                spinner.forPromise(searchPromise);
            };

            $scope.loadingMoreResults = function () {
                return searching && !$scope.noMoreResultsPresent;
            };

            $scope.searchByVillageAndNameAndLocalName = function () {
                var queryParams = {};
                if ($scope.searchParameters.name) {
                    queryParams.name = $scope.searchParameters.name;
                }
                if ($scope.searchParameters.village) {
                    queryParams.village = $scope.searchParameters.village;
                }
                if ($scope.searchParameters.localName && $scope.showLocalNameSearch) {
                    queryParams.localName = $scope.searchParameters.localName;
                }
                $location.search(queryParams);
            };

            $scope.resultsPresent = function () {
                return angular.isDefined($scope.results) && $scope.results.length > 0;
            };

            $scope.editPatientUrl = function (url, options) {
                var temp = url;
                for (var key in options) {
                    temp = temp.replace("{{" + key + "}}", options[key]);
                }
                return temp;
            };

            $scope.nextPage = function () {
                if ($scope.nextPageLoading) {
                    return;
                }
                $scope.nextPageLoading = true;
                var promise = searchBasedOnQueryParameters($scope.results.length);
                if (promise) {
                    promise.success(function (data) {
                        data.results.forEach(function (result) {
                            $scope.results.push(result)
                        });
                        $scope.noMoreResultsPresent = (data.results.length === 0);
                        $scope.nextPageLoading = false;
                    });
                    promise.error(function () {
                        $scope.nextPageLoading = false;
                    });
                }
            };

            $scope.forPatient = function (patient) {
                $scope.selectedPatient = patient;
                return $scope;
            };

            $scope.doExtensionAction = function (extension) {
                var forwardTo = appService.getAppDescriptor().formatUrl(extension.url, { 'patientUuid': $scope.selectedPatient.uuid });
                if (extension.label === 'Print') {
                    var params = identifyParams(forwardTo);
                    if (params.launch === 'dialog') {
                        var firstChar = forwardTo.charAt(0);
                        var prefix = firstChar === "/" ? "#" : "#/";
                        var hiddenFrame = $("#printPatientFrame")[0];
                        hiddenFrame.src = prefix + forwardTo;
                        hiddenFrame.contentWindow.print();
                    } else {
                        $location.url(forwardTo);
                    }
                } else {
                    $location.url(forwardTo);
                }
            };

            $scope.extensionActionText = function (extension) {
                return extension.label;
            }
        }]);
