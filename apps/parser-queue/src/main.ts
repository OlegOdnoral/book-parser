/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';

import { fork, isMaster, isWorker } from 'cluster';
import { cpus } from 'os';
import { pid } from 'process';

import { environment } from './environments/environment';
import { SequelizeConnection, SequelizeConnectionConfigI } from './app/utils/database';
import { BookParser, BookParserClassInput } from './app/controllers/book-parser.controller';
import { BookInfo } from './app/models/book-info.model';

const app = express();


const bookParserConfig: BookParserClassInput = {
  queueName: environment.rabbitQueueName,
  rabbitUri: environment.rabbitUri,
  rabbitUser: environment.rabbitUser,
  rabbitPassword: environment.rabbitPassword,
};
const bookParser = new BookParser(bookParserConfig);


const sequelizeConnectionConfig: SequelizeConnectionConfigI = {
  database: environment.dbDatabase,
    username: environment.dbUser, 
    password: environment.dbPassword, 
    options: {
      dialect: environment.dbDialect,
      host: environment.dbHost,
      logging: environment.production,
      models: [BookInfo]
    }
};
const pgConnection = new SequelizeConnection(sequelizeConnectionConfig);

const port = process.env.port || 3334;

if (isMaster) {
  console.log(`Listening at http://localhost:${port}/api`);
  process.on('uncaughtException', (err) => {
    console.log(err);
  });
  
  pgConnection.connectToDatabase();
  pgConnection.syncWithModels();
  for (let i = 0; i <= cpus().length - 2; i++) {
    
    fork().on('disconnect', () => {
      console.log(`Worker ${pid} disconnect`);
    }).on('uncaughtException', (err) => {
      console.log(`Worker ${pid} has exeption`, err);
    });

  }
}

if (isWorker) {

  app.get('/get_queue_info', async (req, res) => {
    const resData = await bookParser.getQueueInfo();
    res.send(resData);
  });

  const server = app.listen(port, async () => {
    await bookParser.subscribeOnChannel();
    console.log(`Worker was started ${pid}`);
  });
  server.on('error', console.error);

}