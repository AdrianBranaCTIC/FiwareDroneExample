// initializeIoT.js
// This file is used to initialize the IoT simulation.

// Placeholder to keep track of the simulation state
let isIoTSimulationRunning = false;

const {
  startGasSimulation,
  stopGasSimulation
} = require('./gasSensor');

const {
  startHumiditySimulation,
  stopHumiditySimulation
} = require('./humiditySensor');

const {
  startTemperatureSimulation,
  stopTemperatureSimulation
} = require('./temperatureSensor');

const {
  startUVSimulation,
  stopUVSimulation
} = require('./uvSensor');

const {
  startWindSpeedSimulation,
  stopWindSpeedSimulation
} = require('./windSpeedSensor');

const gpsSensor = require('./gpsSensor');

const gpsSimulator1 = new gpsSensor("GPS001",[
    {latitude: 43.49385939359258, longitude: -5.5487598772440165}, //Peon
    {latitude: 43.51163504035255, longitude: -5.528577118724974}, //Arroes
    {latitude: 43.458513458197515, longitude: -5.561957839970137} //Candanal
], 100);

const gpsSimulator2 = new gpsSensor("GPS002", [
    {latitude: 43.48105522798739, longitude: -5.4349809166104945}, //Villaviciosa
    {latitude: 43.53374756177125, longitude: -5.378101214168886}, //Rodiles
    {latitude: 43.54356809000201, longitude: -5.4419425454052535} //Tazones
], 150);

function startIoTSimulation() {
  if (!isIoTSimulationRunning) {
    // Add logic to start IoT simulations
    // For example, start the simulation of each sensor and GPS simulation
    console.log('Starting IoT Simulation...');
    startGasSimulation();
    startHumiditySimulation();
    startUVSimulation();
    startWindSpeedSimulation();
    startTemperatureSimulation();
    gpsSimulator1.startGPSSimulation();
    gpsSimulator2.startGPSSimulation();

    isIoTSimulationRunning = true;
  } else {
    console.log('IoT Simulation is already running.');
  }
}

function stopIoTSimulation() {
  if (isIoTSimulationRunning) {
    // Add logic to stop IoT simulations
    // For example, stop the simulation of each sensor and GPS simulation
    console.log('Stopping IoT Simulation...');
    stopGasSimulation();
    stopHumiditySimulation();
    stopUVSimulation();
    stopWindSpeedSimulation();
    stopTemperatureSimulation();
    gpsSimulator1.stopGPSSimulation();
    gpsSimulator2.stopGPSSimulation();

    isIoTSimulationRunning = false;
  } else {
    console.log('IoT Simulation is not currently running.');
  }
}

// Export the functions to make them accessible in other files
module.exports = {
  startIoTSimulation,
  stopIoTSimulation,
};