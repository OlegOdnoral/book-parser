/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';


import { QueueSender } from './app/parser//parser.controler';

const app = express();

const queueSender = new QueueSender();

app.get('/api', (req, res) => {
  queueSender.getPathToFiles();
  res.send({ message: 'Welcome to book-parser!' });
});

const port = process.env.port || 3333;
const server = app.listen(port, async () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);



