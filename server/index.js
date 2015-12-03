import express from 'express';
const PORT = 5000;
const HOSTNAME = '0.0.0.0';
const app = express();
const server = require('http').createServer(app);


app.get('/', (req, res) => {
  res.send('GET request to the homepage');
});


server.listen(PORT, HOSTNAME, () => {
  /* eslint-disable no-console */
  console.log(`The server is running at http://localhost:${PORT}`);
});
