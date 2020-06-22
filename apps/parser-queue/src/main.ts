/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';

import { fork, isMaster, isWorker, worker } from 'cluster';
import { cpus } from 'os';
import { pid } from 'process';
import { SequelizeConnection } from './app/utils/database';

const app = express();
const queueName = 'books_for_parse';


SequelizeConnection.authenticate().then(async () => {
  console.log("database connected")

  try {
    await SequelizeConnection.sync({ force: true });
  } catch (error) {
    console.log(error.message)
  }

}).catch((e: any) => {
  console.log(e.message)
})

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

    fork().on('disconnect', () => {
      console.log(`Worker ${pid} disconnect`);
    }).on('error', () => {
      console.log(`Worker ${pid} has error`);
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