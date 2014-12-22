Bahmni.Common.RetrospectiveEntry = function() {

    var _encounterDate = Bahmni.Common.Util.DateUtil.getDateWithoutTime(Bahmni.Common.Util.DateUtil.now());
    var _isRetrospective = false;
    var self = this;

    Object.defineProperty(this, 'encounterDate', {
        get: function() {
            return self._encounterDate;
        },
        set: function(value) {
            if (value) {
                self._encounterDate = value;
                self._isRetrospective = value < Bahmni.Common.Util.DateUtil.getDateWithoutTime(Bahmni.Common.Util.DateUtil.now());
            }
        }
    });

    Object.defineProperty(this, 'isRetrospective', {
        get: function() {
            return self._isRetrospective;
        }
    });

}
