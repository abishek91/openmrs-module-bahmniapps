'use strict';

Bahmni.Clinical.TabularLabOrderResults = (function () {
    var TabularLabOrderResults = function (tabularResult) {
        this.tabularResult = tabularResult;
        this.getDateLabels = function () {
            return this.tabularResult.dates.map(function(date) {
                date.date = moment(date.date).toDate();
                return date;  
            });
        };

        this.getTestOrderLabels = function () {
            return this.tabularResult.orders;
        };

        this.hasRange = function(testOrderLabel) {
            return testOrderLabel.minNormal && testOrderLabel.maxNormal;
        };

        this.hasOrders = function() {
            return this.tabularResult.orders.length > 0;
        };

        this.getResult = function(dateLabel, testOrderLabel) {
            return this.tabularResult.values.filter(function(value) {
                return value.dateIndex == dateLabel.index && value.testOrderIndex == testOrderLabel.index;
            })
        };

        this.hasUploadedFiles = function(dateLabel, testOrderLabel) {
            return this.getResult(dateLabel, testOrderLabel).some(function(res) {
                return res.uploadedFileName;
            });
        };
    };

    return TabularLabOrderResults;
})();