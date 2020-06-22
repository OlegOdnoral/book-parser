/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';

import { fork, isMaster, isWorker, worker } from 'cluster';
import { cpus } from 'os';
import { on } from 'process';
import {} from './app/'

const app = express();
const queueName = 'books_for_parse';

// app.get('/api', (req, res) => {
//   res.send({ message: 'Welcome to parser-queue!' });
// });

// const port = process.env.port || 3334;
// const server = app.listen(port, () => {
//   console.log(`Listening at http://localhost:${port}/api`);
// });
// server.on('error', console.error);


if (isMaster) {
  for (let i = 0; i <= cpus().length - 2; i++) {

    fork().on('disconnect', (worker) => {
      //console.log(`Worker ${worker} disconnect`);
    }).on('error', () => {
      
    })

  }
}

if (isWorker) {

  app.get('/api', (req, res) => {
    console.log(`Worker was call ${worker.id}`);
    res.send({ message: 'Welcome to book-parser!' });
  });

  const port = process.env.port || 3334;
  const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/api`);
  });
  server.on('error', console.error);

}