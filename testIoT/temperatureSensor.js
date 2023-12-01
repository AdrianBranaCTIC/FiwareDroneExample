const http = require('http');

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
  setInterval(() => {
    const temperatureValue = simulateTemperatureReading();
    console.log(`Temperature Reading: ${temperatureValue.toFixed(2)} °C`);
    sendTemperatureReading(temperatureValue);
  }, 5000);

  setInterval(() => {
    const statusValue = Math.random() < 0.8 ? "OK" : "FAIL";
    console.log('Status Reading:'+ statusValue);
    sendStatusReading(statusValue);
  }, 20000);
}

module.exports = startTemperatureSimulation;
