const http = require('http');

let temperatureSimulationInterval;
let statusSimulationInterval;

function simulateTemperatureReading() {
  const minTemperature = 20;
  const maxTemperature = 30;
  return minTemperature + Math.random() * (maxTemperature - minTemperature);
}

function sendTemperatureReading(temperatureValue) {
  const data = `reading|${temperatureValue.toFixed(2)}`;
  const options = {
    hostname: 'localhost',
    port: 7896,
    path: '/iot/d?i=TemperatureSensor001&k=TEF',
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'Content-Length': Buffer.byteLength(data),
    },
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log(`Status Code: ${res.statusCode}`);
      console.log('Respuesta del servidor:', data);
    });
  });

  req.on('error', (error) => {
    console.error('Error en la solicitud:', error.message);
  });

  req.write(data);
  req.end();
}

function sendStatusReading(statusValue) {
  const data = `status|${statusValue}`;
  const options = {
    hostname: 'localhost',
    port: 7896,
    path: '/iot/d?i=TemperatureSensor001&k=TEF',
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'Content-Length': Buffer.byteLength(data),
    },
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log(`Status Code: ${res.statusCode}`);
      console.log('Respuesta del servidor:', data);
    });
  });

  req.on('error', (error) => {
    console.error('Error en la solicitud:', error.message);
  });

  req.write(data);
  req.end();
}

function startTemperatureSimulation() {
  temperatureSimulationInterval = setInterval(() => {
    const temperatureValue = simulateTemperatureReading();
    console.log(`Temperature Reading: ${temperatureValue.toFixed(2)} °C`);
    sendTemperatureReading(temperatureValue);
  }, 5000);

  statusSimulationInterval = setInterval(() => {
    const statusValue = Math.random() < 0.8 ? "OK" : "FAIL";
    console.log('Status Reading:'+ statusValue);
    sendStatusReading(statusValue);
  }, 20000);
}

function stopTemperatureSimulation() {
  if (temperatureSimulationInterval) {
    clearInterval(temperatureSimulationInterval);
    temperatureSimulationInterval = null;
    console.log('Temperature Simulation stopped.');
  } else {
    console.log('Temperature Simulation is not currently running.');
  }

  if (statusSimulationInterval) {
    clearInterval(statusSimulationInterval);
    statusSimulationInterval = null;
    console.log('Status Simulation stopped.');
  } else {
    console.log('Status Simulation is not currently running.');
  }
}

module.exports = { startTemperatureSimulation, stopTemperatureSimulation };