Bahmni.Opd.Temp.ObservationMapper = function (encounterConfig) {

    var mapObservation = function (observation) {
        var obs = { conceptUuid: observation.concept.uuid, conceptName : observation.concept.display, conceptUnits : observation.concept.units, observationUuid: "", value: "", members: [] };
        if (observation.value instanceof Object) {
            obs.value = observation.value.uuid;
            obs.valueObject = observation.value;
        } else {
            obs.value = observation.value;
        }
        obs.observationUuid = observation.uuid

        if (observation.setMembers) {
            observation.setMembers.forEach(function (member) {
                obs.members.push(mapObservationNode(member));
            });
        }
        return angular.extend(new Bahmni.Opd.Consultation.Observation(), obs);
    };

    this.map = function (visit) {
        var opdEncounter = visit.encounters.filter(function (encounter) {
            return encounter.encounterType.uuid === encounterConfig.getOpdConsultationEncounterUuid();
        })[0];

        var openMRSObservations = null;
        if (opdEncounter) {
            openMRSObservations = opdEncounter.obs;
        }
        var observations = [];
        for (var i = 0; i < openMRSObservations.length; i++) {
            observations.push(mapObservation(openMRSObservations[i]))
        }
        return observations;
    };
};
