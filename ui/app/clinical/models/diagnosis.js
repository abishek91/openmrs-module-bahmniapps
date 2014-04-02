Bahmni.Clinical.Diagnosis = function (codedAnswer, order, certainty, existingObsUuid,freeTextAnswer,diagnosisDateTime, voided) {
    var self = this;
    self.codedAnswer = codedAnswer;
    self.order = order ? order : "PRIMARY";
    self.certainty = certainty ? certainty : "PRESUMED";
    self.existingObs = existingObsUuid;
    self.freeTextAnswer = freeTextAnswer;
    self.diagnosisDateTime = diagnosisDateTime || new Date();
    self.conceptName = self.codedAnswer.name;
    self.voided = voided;

    self.getDisplayName = function(){
        if(self.freeTextAnswer ){
            return self.freeTextAnswer ;
        }
        else{
            return self.codedAnswer.name;
        }
    };

    self.isPrimary = function(){
        return self.order == "PRIMARY";
    };

    self.isValid = function(){
        return (self.codedAnswer.name !== undefined && self.codedAnswer.uuid !== undefined )
            || (self.codedAnswer.name === undefined && self.freeTextAnswer === undefined);
    };

    self.isEmpty = function(){
        return  self.getDisplayName() === undefined || self.getDisplayName().length === 0;
    };

    self.isRuledOut = function(){
        return self.certainty == Bahmni.Common.Constants.ruledOutCertainty;
    };

    self.isNew = function() {
        return self.existingObs == undefined || self.existingObs == '';
    }
};
