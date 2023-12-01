// models/RoutePointModel.js

class RoutePointModel {
    static format(routePoint) {
      return {
        id: routePoint.id,
        type: routePoint.type,
        altitud: routePoint.altitud,
        location: routePoint.location,
        pointType: routePoint.pointType,
        refDrone: routePoint.refDrone,
        velocidad: routePoint.velocidad,
      };
    }
  }
  
  module.exports = RoutePointModel;
  