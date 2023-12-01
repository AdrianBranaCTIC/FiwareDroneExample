// main.js

const startGasSimulation = require('./gasSensor');
const startHumiditySimulation = require('./humiditySensor');
const startTemperatureSimulation = require('./temperatureSensor');
const startUVSimulation = require('./uvSensor');
const startWindSpeedSimulation = require('./windSpeedSensor');
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

// Inicia todas las simulaciones
startGasSimulation();
startHumiditySimulation();
startUVSimulation();
startWindSpeedSimulation();
startTemperatureSimulation();
gpsSimulator1.startGPSSimulation();
gpsSimulator2.startGPSSimulation();