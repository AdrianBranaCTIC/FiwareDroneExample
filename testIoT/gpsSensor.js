const http = require('http');

class gpsSensor {
  constructor(gpsId, coordinates = [
    {latitude: 43.49385939359258, longitude: -5.5487598772440165}, //Peon
    {latitude: 43.51163504035255, longitude: -5.528577118724974}, //Arroes
    {latitude: 43.458513458197515, longitude: -5.561957839970137} //Candanal
  ], steps = 100) {
    this.gpsId=gpsId;
    this.coordinates = coordinates;
    this.intermediateSteps = steps;
    this.currentIndex = 0;
    this.currentStep = 0;
    this.currentPosition = this.coordinates[this.currentIndex];
  }

  getNextCoordinate() {
    if (this.currentStep < this.intermediateSteps) {
      this.currentStep++;
    } else {
      this.currentIndex = (this.currentIndex + 1) % this.coordinates.length;
      this.currentStep = 0;
    }

    const nextIndex = (this.currentIndex + 1) % this.coordinates.length;
    const t = this.currentStep / this.intermediateSteps;
    const lat = (1 - t) * this.coordinates[this.currentIndex].latitude + t * this.coordinates[nextIndex].latitude;
    const lon = (1 - t) * this.coordinates[this.currentIndex].longitude + t * this.coordinates[nextIndex].longitude;

    return {latitude: lat, longitude: lon};
  }

  simulateGPSReading() {
    const nextCoordinate = this.getNextCoordinate();
    return {
      latitude: nextCoordinate.latitude,
      longitude: nextCoordinate.longitude
    };
  }

  sendGPSReading(latitude, longitude) {
    const data = `latitude|${latitude.toFixed(6)}|longitude|${longitude.toFixed(6)}`;
    const options = {
      hostname: 'localhost',
      port: 7896,
      path: `/iot/d?i=${this.gpsId}&k=TEF`,
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

  startGPSSimulation() {
    setInterval(() => {
      const { latitude, longitude } = this.simulateGPSReading();
      console.log(`GPS Reading: Latitud ${latitude.toFixed(6)}, Longitud ${longitude.toFixed(6)}`);
      this.sendGPSReading(latitude, longitude);
    }, 1000);
  }
}

module.exports = gpsSensor;