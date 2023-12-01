const http = require('http');

function simulateWindSpeed() {
  const minWindSpeed = 0;
  const maxWindSpeed = 10;

  return minWindSpeed + Math.random() * (maxWindSpeed - minWindSpeed);
}

function sendWindSpeedReading(windSpeed) {
  const data = `reading|${windSpeed.toFixed(2)}`;
  const options = {
    hostname: 'localhost',
    port: 7896,
    path: '/iot/d?i=WindSpeedSensor001&k=TEF',
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

function startWindSpeedSimulation() {
  setInterval(() => {
    const windSpeed = simulateWindSpeed();
    console.log(`Wind Speed: ${windSpeed.toFixed(2)} m/s`);
    sendWindSpeedReading(windSpeed);
  }, 12000);
}

module.exports = startWindSpeedSimulation;
