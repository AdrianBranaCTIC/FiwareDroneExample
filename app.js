const express = require('express');
const ejs = require('ejs');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const ResponseModel = require('./models/ResponseModel');

const app = express();
const port = 3000;

// Middleware para analizar el cuerpo de las solicitudes como JSON
app.use(bodyParser.json());

app.use(cors());

// Configuración de la vista
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Rutas
app.get('/', (req, res) => {
  res.render('index');
});

// Ruta para recibir notificaciones POST en /monitor
app.post('/monitor', (req, res) => {
  
    // Procesar la notificación
    const notificationData = req.body;
    console.log('Notificación recibida Monitor:', notificationData);

    // Enviar la notificación a la vista monitor.ejs
    io.emit('notificationMonitor', notificationData);    

    // Responder a la solicitud con un código 200 (OK)
    res.status(200).send('Notificación recibida Monitor');
});

// Ruta para renderizar la vista monitor.ejs
app.get('/monitor', (req, res) => {
  res.render('monitor');
});

// Ruta para recibir notificaciones POST en /iotdevices
app.post('/iotdevices', (req, res) => {
  // Procesar la notificación
  const notificationData = req.body;
  console.log('Notificación recibida IoT:', notificationData);

  // Emitir la notificación a través de WebSocket
  io.emit('notificationIoT', notificationData);

  // Responder a la solicitud con un código 200 (OK)
  res.status(200).send('Notificación recibida IoT');
});

// Ruta para mostrar la lista de IoT Devices
app.get('/iotdevices', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:1026/v2/types?options=values', {
      headers: {
        'fiware-service': 'openiot',
        'fiware-servicepath': '/project'
      }
    });
    const types = response.data;

    // Fetch devices for each type
    const devices = {};
    for (const type of types) {
      const deviceResponse = await axios.get('http://localhost:1026/v2/entities?type='+type+'&options=keyValues', {
        headers: {
          'fiware-service': 'openiot',
          'fiware-servicepath': '/project'
        }
      });
      const devicesForType = deviceResponse.data.map(device => {
        return {
          id: device.id,
          status: device.status,
          lastReading: device.TimeInstant.replace(/T/, ' ').replace(/\..+/, ''),
          reading: device.reading
        };
      });
      devices[type] = devicesForType;
    }

    res.render('listIoT', { types, devices });
  } catch (error) {
    console.error('Error al realizar la solicitud HTTP GET:', error.message);
    res.status(500).send('Error al obtener IoT Devices');
  }
});

// Ruta para mostrar la lista de Entities del context
app.get('/entities', async (req, res) => {
  const entityType = req.params.type;
  try {
    const response = await axios.get('http://localhost:1026/v2/types?options=values');
    const types = response.data;
    res.render('listEntities', { types});
  } catch (error) {
    console.error('Error al realizar la solicitud HTTP GET:', error.message);
    res.status(500).send('Error al obtener entidades');
  }
});

// Ruta para mostrar entidades de un tipo específico
app.get('/entities/:type', async (req, res) => {
  const entityType = req.params.type;
  try {
    const response = await axios.get(`http://localhost:1026/v2/entities?type=${entityType}&options=keyValues`);
    const entities = response.data;
    res.render('entities', { entities, entityType });
  } catch (error) {
    console.error('Error al realizar la solicitud HTTP GET:', error.message);
    res.status(500).send('Error al obtener entidades');
  }
});

// Ruta para mostrar el mapa de puntos de ruta de un drone
app.get('/map/:droneId', async (req, res) => {
    const droneId = req.params.droneId;
    try {
        const url = 'http://localhost:1026/v2/entities?options=keyValues';
        const params = {
            q: 'refDrone=='+droneId,
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
        //console.log(JSON.stringify(routePoints, null, 2));
        //console.log(routePoints);

        res.render('map', { routePoints, droneId }); // Pasa las entidades como un objeto con los puntos de ruta
    } catch (error) {
        console.error('Error al realizar la solicitud HTTP GET:', error.message);
        res.status(500).send('Error al obtener puntos de ruta del drone');
    }
});

// Ruta para recibir notificaciones POST en /maphub
app.post('/maphub', (req, res) => {
  
  // Procesar la notificación
  const notificationData = req.body;

  // Check if the notification is intended for /maphub
  if (notificationData.type="GPS") {
    console.log('Notificación recibida MapHub:', notificationData);
    // Enviar la notificación a la vista monitor.ejs
    io.emit('notificationMap', notificationData);
  }

  // Responder a la solicitud con un código 200 (OK)
  res.status(200).send('Notificación recibida MapHub');
});

// Ruta para mostrar el mapa de drones en tiempo real
app.get('/maphub', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:1026/v2/entities?type=GPS&options=keyValues', {
      headers: {
        'fiware-service': 'openiot',
        'fiware-servicepath': '/project'
      }
    });
    const drones = response.data.map(resp => {
      return {
        Name: resp.refDrone,
        Latitude: resp.latitude,
        Longitude: resp.longitude
      };
    });
      //const drones = response.data.map(resp => ResponseModel.format(resp));
      console.log(drones);

      res.render('maphub', { drones }); // Pass the drones as data to the maphub.ejs view
  } catch (error) {
      console.error('Error al realizar la solicitud HTTP GET:', error.message);
      res.status(500).send('Error al obtener la lista de drones');
  }
});

// Iniciar servidor
const server = app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

// Configurar Socket.IO para permitir la comunicación en tiempo real
const io = require('socket.io')(server);

// Manejar conexiones de clientes WebSocket
io.on('connection', (socket) => {
  console.log('Cliente conectado al servidor WebSocket');

  // Manejar desconexiones de clientes WebSocket
  socket.on('disconnect', () => {
    console.log('Cliente desconectado del servidor WebSocket');
  });
});