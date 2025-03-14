const express = require('express');
const ejs = require('ejs');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');

const initializeIoT = require('./testIoT/initializeIoT');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = process.env.PORT || 3000;
const basePath = process.env.BASEPATH || 'http://localhost:1026/v2';

// Middleware para analizar el cuerpo de las solicitudes como JSON
app.use(bodyParser.json());
app.use(cors());

// Configuración de la vista
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Rutas
app.get('/', (req, res) => res.render('index'));

app.post('/startIoTSimulation', (req, res) => {
  try {
    initializeIoT.startIoTSimulation();
    res.json({ message: 'IoT Simulation started successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to start IoT Simulation' });
  }
});

app.post('/stopIoTSimulation', (req, res) => {
  try {
    initializeIoT.stopIoTSimulation();
    res.json({ message: 'IoT Simulation stopped successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to stop IoT Simulation' });
  }
});

app.post('/monitor', async (req, res) => {
  try {
    const notificationData = req.body;
    console.log('Notificación recibida Monitor:', notificationData);
    io.emit('notificationMonitor', notificationData);
    res.status(200).send('Notificación recibida Monitor');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/monitor', (req, res) => res.render('monitor'));

app.post('/iotdevices', async (req, res) => {
  try {
    const notificationData = req.body;
    console.log('Notificación recibida IoT:', notificationData);
    io.emit('notificationIoT', notificationData);
    res.status(200).send('Notificación recibida IoT');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/iotdevices', async (req, res) => {
  try {
    const response = await axios.get(`${basePath}/types?options=values`, {
      headers: {
        'fiware-service': 'openiot',
        'fiware-servicepath': '/project'
      }
    });

    const types = response.data;
    const devices = {};

    for (const type of types) {
      const deviceResponse = await axios.get(`${basePath}/entities?type=${type}&options=keyValues`, {
        headers: {
          'fiware-service': 'openiot',
          'fiware-servicepath': '/project'
        }
      });

      const devicesForType = deviceResponse.data.map(device => ({
        id: device.id,
        status: device.status,
        lastReading: device.TimeInstant.replace(/T/, ' ').replace(/\..+/, ''),
        reading: device.reading
      }));

      devices[type] = devicesForType;
    }

    res.render('listIoT', { types, devices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Ruta para mostrar la lista de Types de Entities del context
app.get('/entities', async (req, res) => {
  const entityType = req.params.type;
  try {
    const response = await axios.get(`${basePath}/types?options=values`);
    const types = response.data;
    res.render('listEntities', { types });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Ruta para mostrar entidades de un tipo específico
app.get('/entities/:type', async (req, res) => {
  const entityType = req.params.type;
  try {
    const response = await axios.get(`${basePath}/entities?type=${entityType}&options=keyValues`);
    const entities = response.data;
    res.render('entities', { entities, entityType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Ruta para mostrar el mapa de puntos de ruta de un drone
app.get('/map/:droneId', async (req, res) => {
  const droneId = req.params.droneId;
  try {
    const url = `${basePath}/entities?options=keyValues`;
    const params = {
      q: 'refDrone==' + droneId,
      options: 'keyValues',
      attrs: 'location',
      type: 'RoutePoint'
    };

    const response = await axios.get(url, { params });
    const routePoints = response.data.map(resp => {
      return {
        id: resp.id,
        latitude: resp.location.coordinates[0],
        longitude: resp.location.coordinates[1]
      };
    });

    res.render('map', { routePoints, droneId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Ruta para recibir notificaciones POST en /maphub
app.post('/maphub', (req, res) => {
  try {
    const notificationData = req.body;

    //if (notificationData.type === "GPS") {
      console.log('Notificación recibida MapHub:', notificationData);
      io.emit('notificationMap', notificationData);
    //}
    res.status(200).send('Notificación recibida MapHub');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Ruta para mostrar el mapa de drones en tiempo real
app.get('/maphub', async (req, res) => {
  try {
    const response = await axios.get(`${basePath}/entities?type=GPS&options=keyValues`, {
      headers: {
        'fiware-service': 'openiot',
        'fiware-servicepath': '/project'
      }
    });
    const drones = response.data.map(resp => ({
      Name: resp.refDrone,
      Latitude: resp.latitude,
      Longitude: resp.longitude
    }));
    console.log(drones);
    res.render('maphub', { drones });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Iniciar servidor
server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

// Configurar Socket.IO para permitir la comunicación en tiempo real
io.on('connection', (socket) => {
  console.log('Cliente conectado al servidor WebSocket');

  // Manejar desconexiones de clientes WebSocket
  socket.on('disconnect', () => {
    console.log('Cliente desconectado del servidor WebSocket');
  });
});
