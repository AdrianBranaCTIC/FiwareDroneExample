const http = require('http');

let humiditySimulationInterval;

function simulateHumidityReading() {
  const minHumidity = 30;
  const maxHumidity = 70;

  return minHumidity + Math.random() * (maxHumidity - minHumidity);
}

function sendHumidityReading(humidityReading) {
  const data = `reading|${humidityReading.toFixed(2)}`;
  const options = {
    hostname: 'localhost',
    port: 7896,
    path: '/iot/d?i=HumiditySensor001&k=TEF',
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

function startHumiditySimulation() {
  humiditySimulationInterval = setInterval(() => {
    const humidityReading = simulateHumidityReading();
    console.log(`Humidity Reading: ${humidityReading.toFixed(2)}%`);
    sendHumidityReading(humidityReading);
  }, 25000);
}

function stopHumiditySimulation() {
  if (humiditySimulationInterval) {
    clearInterval(humiditySimulationInterval);
    humiditySimulationInterval = null;
    console.log('Humidity Simulation stopped.');
  } else {
    console.log('Humidity Simulation is not currently running.');
  }
}

module.exports = { startHumiditySimulation, stopHumiditySimulation };