const NgsiV2 = require("ngsi_v2");
const defaultClient = NgsiV2.ApiClient.instance;
defaultClient.basePath = process.env.CONTEXT_BROKER || "http://localhost:1026/v2";
const SensorModel = require('../models/SensorModel');
const DroneModel = require('../models/DroneModel');
const DroneStationModel = require('../models/DroneStationModel');
const ModelModel = require('../models/ModelModel');
const RoutePointModel = require('../models/RoutePointModel');
const ResponseModel = require('../models/ResponseModel');

function retrieveEntity(entityId, opts) {
    return new Promise(function(resolve, reject) {
        const apiInstance = new NgsiV2.EntitiesApi();
        apiInstance.retrieveEntity(entityId, opts, (error, data) => {
            return error ? reject(error) : resolve(data);
        });
    });
}

function displaySensor(req, res) {
    retrieveEntity(req.params.sensorId, { options: "keyValues", type: "Sensor" })
        .then(sensor => {
            // If a store has been found display it on screen
            return res.render("sensor", { title: sensor.name, sensor });
        })
        .catch(error => {
            debug(error);
            // If no store has been found, display an error screen
            return res.render("sensor-error", { title: "Error", error });
        });
}

// Importa la biblioteca 'axios' para realizar solicitudes HTTP
const axios = require('axios');

async function displaySensors() {
  try {
    const response = await axios.get('http://localhost:1026/v2/entities?type=Sensor&options=keyValues');
    
    // Extract and format the relevant information
    const sensorData = response.data.map(sensor => SensorModel.format(sensor));


    // Convert the formatted data to a JSON string and log it
    console.log(JSON.stringify(sensorData, null, 2));
  } catch (error) {
    console.error('Error al realizar la solicitud HTTP GET:', error.message);
  }
}

// Llama a la función 'displaySensors'
//displaySensors();

async function displayDrones() {
    try {
      const response = await axios.get('http://localhost:1026/v2/entities?type=Drone&options=keyValues');
      
      // Use DroneModel to format each drone in the response
      const droneData = response.data.map(drone => DroneModel.format(drone));
  
      // Convert the formatted data to a JSON string and log it
      console.log(JSON.stringify(droneData, null, 2));
    } catch (error) {
      console.error('Error al realizar la solicitud HTTP GET:', error.message);
    }
  }
  
  // Llama a la función 'displayDrones'
  //displayDrones();

  async function displayDroneStations() {
    try {
      const response = await axios.get('http://localhost:1026/v2/entities?type=DroneStation&options=keyValues');
      
      // Usa DroneStationModel para formatear cada estación de drones en la respuesta
      const droneStationData = response.data.map(droneStation => DroneStationModel.format(droneStation));
  
      // Convierte los datos formateados a una cadena JSON y muéstrala en la consola
      console.log(JSON.stringify(droneStationData, null, 2));
    } catch (error) {
      console.error('Error al realizar la solicitud HTTP GET:', error.message);
    }
  }

  //displayDroneStations();

  async function displayModels() {
    try {
      const response = await axios.get('http://localhost:1026/v2/entities?type=Model&options=keyValues');
      
      // Usa ModelModel para formatear cada modelo de drone en la respuesta
      const modelData = response.data.map(model => ModelModel.format(model));
  
      // Convierte los datos formateados a una cadena JSON y muéstrala en la consola
      console.log(JSON.stringify(modelData, null, 2));
    } catch (error) {
      console.error('Error al realizar la solicitud HTTP GET:', error.message);
    }
  }

  //displayModels();

  async function displayRoutePoints() {
    try {
      const response = await axios.get('http://localhost:1026/v2/entities?type=RoutePoint&options=keyValues');
      
      // Usa RoutePointModel para formatear cada punto de ruta en la respuesta
      const routePointData = response.data.map(routePoint => RoutePointModel.format(routePoint));
  
      // Convierte los datos formateados a una cadena JSON y muéstrala en la consola
      console.log(JSON.stringify(routePointData, null, 2));
    } catch (error) {
      console.error('Error al realizar la solicitud HTTP GET:', error.message);
    }
  }

  //displayRoutePoints();

  async function displayRoutePointsFromDrone(droneId) {
    try {
        const url = 'http://localhost:1026/v2/entities';
        const params = {
            q: `refDrone==urn:ngsi-ld:Drone:${droneId}`,
            options: 'count',
            options:'keyValues',
            attrs: 'location',
            type: 'RoutePoint'
        };

        const response = await axios.get(url, { params });

        // Usa RoutePointModel para formatear cada punto de ruta en la respuesta
        const respData = response.data.map(resp => ResponseModel.format(resp));

        // Convierte los datos formateados a una cadena JSON y muéstrala en la consola
        console.log(JSON.stringify(respData, null, 2));

    } catch (error) {
        console.error('Error al realizar la solicitud HTTP GET:', error.message);
    }
}

// Llamada a la función con el ID del drone como parámetro
const droneId = '001'; // Cambia esto con el ID correcto
displayRoutePointsFromDrone(droneId);
