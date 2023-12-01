// models/DroneStationModel.js

class DroneStationModel {
    static format(droneStation) {
      return {
        id: droneStation.id,
        type: droneStation.type,
        capacity: droneStation.capacity,
        description: droneStation.description,
        location: droneStation.location,
        name: droneStation.name,
        state: droneStation.state,
        stationType: droneStation.stationType,
      };
    }
  }
  
  module.exports = DroneStationModel;
  