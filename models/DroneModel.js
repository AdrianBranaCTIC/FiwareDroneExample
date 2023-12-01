// models/DroneModel.js

class DroneModel {
    static format(drone) {
      return {
        id: drone.id,
        type: drone.type,
        model: drone.model,
        numSensorsInstalled: drone.numSensorsInstalled,
        refModel: drone.refModel,
        refDroneStation: drone.refDroneStation,
        state: drone.state,
      };
    }
  }
  
  module.exports = DroneModel;