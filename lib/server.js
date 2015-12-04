/* eslint-disable no-unused-vars */
import express from 'express';
import bodyParser from 'body-parser';
import { INVALID_JSON, AUTH_REQUIRED } from './constants/errors';
const PORT = 5000;
const HOSTNAME = '0.0.0.0';

const app = express();
const server = require('http').createServer(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  let apiKey;
  try {
    apiKey = req.get('Authorization').split('"api-key"=')[1];
  } catch (e) {
    apiKey = null;
  }
  req.apiKey = apiKey;
  if (!apiKey) {
    return res.status(401).json({
      status: 401,
      ...AUTH_REQUIRED,
    });
  }
  next();
});

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
