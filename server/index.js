import express from 'express';
import bodyParser from 'body-parser';
const PORT = 5000;
const HOSTNAME = '0.0.0.0';

const app = express();
const server = require('http').createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use([
  require('./drafts'),
]);

app.get('/', (req, res) => {
  res.send('Welcome to Ediket API!');
});

server.listen(PORT, HOSTNAME, () => {
  /* eslint-disable no-console */
  console.log(`The server is running at http://localhost:${PORT}`);
});
