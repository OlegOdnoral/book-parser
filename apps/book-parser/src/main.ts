/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';

import { parseFile, parseFileSync } from './app/parser/parser.controler';

import { fork, isMaster, isWorker, worker } from 'cluster';
import { cpus } from 'os';

const app = express();

app.get('/api', (req, res) => {
  parseFileSync();
  res.send({ message: 'Welcome to book-parser!' });
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);

// if (isMaster) {
//   for (let i = 0; i <= cpus().length - 2; i++) {
//     fork().on('disconnect', (worker) => {
//       console.log(`Worker ${worker} disconnect`);
//     }).on('exit', (worker) => {
//       console.log(`Worker ${worker} exit`);
//     });
//   }
// }

// if (isWorker) {

//   app.get('/api', (req, res) => {
//     console.log(`Worker was call ${worker.id}`);
//     parseFile();
//     res.send({ message: 'Welcome to book-parser!' });
//   });

//   const port = process.env.port || 3333;
//   const server = app.listen(port, () => {
//     console.log(`Listening at http://localhost:${port}/api`);
//   });
//   server.on('error', console.error);

// }


