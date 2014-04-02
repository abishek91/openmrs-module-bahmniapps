'use strict';
Bahmni.Common.Util.ArrayUtil = {
    chunk: function(array, chunkSize) {
        var chunks = [];
        for (var i = 0; i < array.length; i += chunkSize) chunks.push(array.slice(i, i + chunkSize));
        return chunks;
    },

    removeItem: function(array, item) {
    	var index = array.indexOf(item);
    	this.removeItemAt(array, index);
    },

    removeItemAt: function(array, index) {
        if(index !== -1) {
            array.splice(index, 1)
        }
    },

    clone: function (array) {
        var clonedArray = [];
        if(array && array.length > 0){
            array.forEach(function (element) {
                clonedArray.push(element);
            });
        }
        return clonedArray;
    },

    presentInList: function (array, element, fieldToCompare){
        var isPresent = false;
        array.forEach(function(arrayElement){
            if(arrayElement[fieldToCompare] == element[fieldToCompare]){
                isPresent = true;
            }
        });
        return isPresent;
    }
};