Bahmni.Common.Obs.GridObservation = (function () {

    var GridObservation = function (obs, conceptConfig) {
        angular.extend(this, obs);
        this.type = "grid";
        this.conceptConfig = conceptConfig;
    };

    GridObservation.prototype = {

        isFormElement: function () {
            return true;
        },

        getDisplayValue: function () {
            return this.value;
        }

    };
    
    return GridObservation;

})();