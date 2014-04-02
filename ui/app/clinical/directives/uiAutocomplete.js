angular.module('bahmni.clinical')
.directive('uiAutocomplete', function () {
    return function (scope, element, attrs) {
        element.autocomplete({
            autofocus:true,
            minLength:2,
            source:function (request, response) {
                scope.getDiagnosis(request.term).success(function (data) {
                    var mappedResponse = data.map(
                        function (concept) {
                            if (concept.conceptName === concept.matchedName) {
                                return {
                                    'value':concept.matchedName,
                                    'concept':{
                                        'name': concept.conceptName,
                                        'uuid':concept.conceptUuid
                                    }
                                }
                            }
                            return {
                                'value':concept.matchedName + "=>" + concept.conceptName,
                                'concept':{
                                    'name': concept.conceptName,
                                    'uuid': concept.conceptUuid
                                }
                            }
                        }
                    );
                    var filteredOutDiagnoses = scope.filterOutSelectedDiagnoses(mappedResponse);
                    response(filteredOutDiagnoses);
                });
            },
            search:function (event) {
                var searchTerm = $.trim(element.val());
                if (searchTerm.length < 2) {
                    event.preventDefault();
                }
            },
            select:function (event, ui) {
                scope.selectItem(ui.item, scope.$index);
                scope.$eval(attrs.ngChange);
                return true;
            }
        });
    }
});