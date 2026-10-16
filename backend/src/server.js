const path = require('path');
const { createApp } = require('./app');
const { createStore } = require('./store');

const PORT = Number(process.env.PORT) || 3000;
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, '..', 'data', 'db.json');

const app = createApp(createStore(DATA_FILE));

// 0.0.0.0 pour que le téléphone (Expo Go) puisse joindre l'API sur le réseau Wi-Fi local.
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API Traficam démarrée sur http://localhost:${PORT}`);
});
