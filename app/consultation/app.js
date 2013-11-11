'use strict';

angular.module('consultation', ['opd.consultation','opd.bedManagement', 'bahmni.common.infrastructure', 'bahmni.common.patient', 'opd.conceptSet', 'authentication']);
angular.module('consultation').config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
        $routeProvider.when('/visit/:visitUuid/', {templateUrl: 'modules/consultation/views/consultation.html', controller: 'ConsultationController', resolve: {initialization: 'initialization'}});
        $routeProvider.when('/visit/:visitUuid/diagnosis', {templateUrl: 'modules/consultation/views/addObservation.html', controller: 'DiagnosisController', resolve: {initialization: 'initialization'}});
        $routeProvider.when('/visit/:visitUuid/treatment', {templateUrl: 'modules/consultation/views/treatment.html', controller: 'TreatmentController', resolve: {initialization: 'initialization'}});
        $routeProvider.when('/visit/:visitUuid/investigation', {templateUrl: 'modules/consultation/views/investigations.html', controller: 'InvestigationController', resolve: {initialization: 'initialization'}});
        $routeProvider.when('/visit/:visitUuid/notes', {templateUrl: 'modules/consultation/views/notes.html'});
        $routeProvider.when('/visit/:visitUuid/templates', {templateUrl: 'modules/consultation/views/comingSoon.html'});
        $routeProvider.when('/visit/:visitUuid/disposition', {templateUrl: 'modules/consultation/views/disposition.html',controller: 'DispositionController',resolve: {initialization: 'initialization'}});
        $routeProvider.when('/visit/:visitUuid/bed-management', {templateUrl: 'modules/bed-management/views/wardsList.html',controller: 'WardsListController',resolve: {initialization: 'initialization'}});
        $routeProvider.when('/visit/:visitUuid/bed-management/wardLayout/:wardId', {templateUrl: 'modules/bed-management/views/wardLayout.html',controller: 'WardLayoutController',resolve: {initialization: 'initialization'}});
        //$routeProvider.when('/visit/:visitUuid/concept-set/:conceptSet', {templateUrl: 'modules/concept-set/views/conceptSetView.html',controller: 'ConceptSetController',resolve: {initialization: 'initialization'}});
        $routeProvider.when('/visit/:visitUuid/concept-set/:conceptSet', {templateUrl: 'modules/concept-set/views/conceptSetView.html',resolve: {initialization: 'initialization'}});
        $routeProvider.otherwise({redirectTo: Bahmni.Opd.Constants.activePatientsListUrl});
        $httpProvider.defaults.headers.common['Disable-WWW-Authenticate'] = true;
}]);
