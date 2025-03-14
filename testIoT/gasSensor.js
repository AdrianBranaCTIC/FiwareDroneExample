const http = require('http');

const basePathIoTA = process.env.BASEPATHIOTA || 'localhost';

let gasSimulationInterval; // Variable to store the interval ID

function simulateGasConcentration() {
  const minConcentration = 50;
  const maxConcentration = 500;

  return minConcentration + Math.random() * (maxConcentration - minConcentration);
}

function sendGasReading(gasConcentration) {
  const data = `reading|${gasConcentration.toFixed(2)}`;
  const options = {
    hostname: basePathIoTA,
    port: 7896,
    path: '/iot/d?i=GasSensor001&k=TEF',
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

function startGasSimulation() {
  gasSimulationInterval = setInterval(() => {
    const gasConcentration = simulateGasConcentration();
    console.log(`Gas Concentration: ${gasConcentration.toFixed(2)} ppm`);
    sendGasReading(gasConcentration);
  }, 30000);
}

function stopGasSimulation() {
  if (gasSimulationInterval) {
    clearInterval(gasSimulationInterval);
    console.log('Gas Simulation stopped.');
  } else {
    console.log('Gas Simulation is not currently running.');
  }
}

module.exports = {
  startGasSimulation,
  stopGasSimulation,
};
