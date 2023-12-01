// models/ResponseModel.js

class ResponseModel {
    static format(response) {
      return {
        id: response.id,
        location: response.location.coordinates,
      };
    }
  }
  
  module.exports = ResponseModel; 