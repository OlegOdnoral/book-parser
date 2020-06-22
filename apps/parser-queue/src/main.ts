/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';

import { fork, isMaster, isWorker, worker } from 'cluster';
import { cpus } from 'os';
import { pid } from 'process';

import { ConnectToDb } from './app/utils/database';
import { BookParser } from './app/controllers/book-parse.controller';

const app = express();


const bookParser = new BookParser();
ConnectToDb();
// app.get('/api', (req, res) => {
//   res.send({ message: 'Welcome to parser-queue!' });
// });

// const port = process.env.port || 3334;
// const server = app.listen(port, () => {
//   bookParser.subscribeOnChannel();
//   console.log(`Listening at http://localhost:${port}/api`);
// });
// server.on('error', console.error);


if (isMaster) {
  for (let i = 0; i <= cpus().length - 2; i++) {

    fork().on('disconnect', () => {
      console.log(`Worker ${pid} disconnect`);
    }).on('error', () => {
      console.log(`Worker ${pid} has error`);
    })

  }
}

if (isWorker) {

  app.get('/api', (req, res) => {
    //console.log(`Worker was call ${pid}`);
    res.send({ message: 'Welcome to book-parser!' });
  });

  const port = process.env.port || 3334;
  const server = app.listen(port, () => {
    bookParser.subscribeOnChannel();
    console.log(`Worker was started ${pid}`);
    console.log(`Listening at http://localhost:${port}/api`);
  });
  server.on('error', console.error);

}