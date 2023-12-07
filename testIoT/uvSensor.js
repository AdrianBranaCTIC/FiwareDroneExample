const http = require('http');

const basePathIoTA = process.env.BASEPATHIOTA || 'localhost';

let uvSimulationInterval;

function simulateUVIndex() {
  const minUVIndex = 1;
  const maxUVIndex = 10;

  return minUVIndex + Math.random() * (maxUVIndex - minUVIndex);
}

function sendUVReading(uvIndex) {
  const data = `reading|${uvIndex.toFixed(2)}`;
  const options = {
    hostname: basePathIoTA,
    port: 7896,
    path: '/iot/d?i=UVSensor001&k=TEF',
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

function startUVSimulation() {
  uvSimulationInterval = setInterval(() => {
    const uvIndex = simulateUVIndex();
    console.log(`UV Index: ${uvIndex.toFixed(2)}`);
    sendUVReading(uvIndex);
  }, 15000);
}

function stopUVSimulation() {
  if (uvSimulationInterval) {
    clearInterval(uvSimulationInterval);
    uvSimulationInterval = null;
    console.log('UV Simulation stopped.');
  } else {
    console.log('UV Simulation is not currently running.');
  }
}

module.exports = { startUVSimulation, stopUVSimulation };