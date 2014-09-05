Bahmni.Clinical.DrugOrderViewModel = function (extensionParams, routes, durationUnits) {
    var getDefaultValue = function (defaultValue, valueSet) {
        var selectedValue = defaultValue && _.find(valueSet, function (value) {
            return value.name === defaultValue;
        });
        return selectedValue;
    };

    var self = this;
    this.asNeeded = false;
    this.route = getDefaultValue(extensionParams && extensionParams.defaultRoute, routes);
    this.durationUnit = getDefaultValue(extensionParams && extensionParams.defaultDurationUnit, durationUnits);
    this.scheduledDate = new Date();
    this.frequencyType = "uniform";
    this.uniformDosingType = {};
    this.variableDosingType = {};
    this.durationInDays = 0;

    var simpleDoseAndFrequency = function () {
        var uniformDosingType = self.uniformDosingType;
        var doseAndUnits = blankIfFalsy(uniformDosingType.dose) + " " + blankIfFalsy(uniformDosingType.doseUnits);
        return addDelimiter(blankIfFalsy(doseAndUnits), ", ") +
            addDelimiter(blankIfFalsy(uniformDosingType.frequency && uniformDosingType.frequency.name), ", ");
    };

    var numberBasedDoseAndFrequency = function () {
        var variableDosingType = self.variableDosingType;
        var variableDosingString = addDelimiter((variableDosingType.morningDose || 0) + "-" + (variableDosingType.afternoonDose || 0) + "-" + (variableDosingType.eveningDose || 0), " ");
        return addDelimiter((variableDosingString + blankIfFalsy(variableDosingType.doseUnits)).trim(), ", ")
    };

    var asNeeded = function (asNeeded) {
        return asNeeded ? "SOS" : '';
    };

    var blankIfFalsy = function (value) {
        return value ? value.toString().trim() : "";
    };

    var getDoseAndFrequency = function () {
        return self.frequencyType === "uniform" ? simpleDoseAndFrequency() : numberBasedDoseAndFrequency();
    };

    var addDelimiter = function (item, delimiter) {
        return item && item.length > 0 ? item + delimiter : item;
    };

    this.getDescription = function () {
        return addDelimiter(blankIfFalsy(getDoseAndFrequency()), " ") +
            addDelimiter(blankIfFalsy(self.instructions), ", ") +
            addDelimiter(blankIfFalsy(asNeeded(self.asNeeded)), ', ') +
            addDelimiter(blankIfFalsy(self.route && self.route.name), " - ") +
            addDelimiter(blankIfFalsy(self.duration), " ") +
            addDelimiter(blankIfFalsy(self.durationUnit && self.durationUnit.name), " (") +
            addDelimiter(blankIfFalsy(self.quantity), " ") +
            addDelimiter(blankIfFalsy(self.quantityUnit), ")");
    };

    this.calculateDurationUnit = function() {
        if(this.frequencyType === "uniform") {
            var frequency = this.uniformDosingType.frequency;
            if(frequency.frequencyPerDay > 4) {
                this.durationUnit = _.find(durationUnits, {name: "Hours"});
            } else if(frequency.frequencyPerDay >= 0.5) {
                this.durationUnit = _.find(durationUnits, {name: "Days"});
            } else {
                this.durationUnit = _.find(durationUnits, {name: "Weeks"});
            }
        }
    };

    this.setFrequencyType = function (type) {
        self.frequencyType = type;
        if (self.frequencyType === "uniform") {
            self.variableDosingType = {};
        }
        else
            self.uniformDosingType = {};
    };

    this.setQuantityEnteredManually = function() {
        this.quantityEnteredManually = true;
    };

    this.calculateDurationInDays = function() {
        this.durationInDays = this.duration * (this.durationUnit && this.durationUnit.factor || 1);
    };

    this.calculateQuantity = function () {
        this.calculateDurationInDays();
        if(!this.quantityEnteredManually){
            if(this.frequencyType == "uniform") {
                this.quantity = this.uniformDosingType.dose * (this.uniformDosingType.frequency ? this.uniformDosingType.frequency.frequencyPerDay : 0) * this.durationInDays;
                this.quantityUnit = this.uniformDosingType.doseUnits;
            }
            else {
                var dose = this.variableDosingType;
                this.quantity = (dose.morningDose + dose.afternoonDose + dose.eveningDose) * this.durationInDays;
                this.quantityUnit = this.variableDosingType.doseUnits;
            }
        }
    };
};
