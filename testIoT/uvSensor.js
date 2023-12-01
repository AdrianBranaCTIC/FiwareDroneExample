const http = require('http');

function simulateUVIndex() {
  const minUVIndex = 1;
  const maxUVIndex = 10;

  return minUVIndex + Math.random() * (maxUVIndex - minUVIndex);
}

function sendUVReading(uvIndex) {
  const data = `reading|${uvIndex.toFixed(2)}`;
  const options = {
    hostname: 'localhost',
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
  setInterval(() => {
    const uvIndex = simulateUVIndex();
    console.log(`UV Index: ${uvIndex.toFixed(2)}`);
    sendUVReading(uvIndex);
  }, 15000);
}

module.exports = startUVSimulation;
