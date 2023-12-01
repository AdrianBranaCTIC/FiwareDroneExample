// models/ModelModel.js

class ModelModel {
    static format(model) {
      return {
        id: model.id,
        type: model.type,
        autonomy: model.autonomy,
        brand: model.brand,
        chargingTime: model.chargingTime,
        maximumSpeed: model.maximumSpeed,
        modelName: model.modelName,
      };
    }
  }
  
  module.exports = ModelModel;
  