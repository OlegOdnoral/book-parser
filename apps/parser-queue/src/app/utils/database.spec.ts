import { SequelizeConnectionConfigI, SequelizeConnection } from './database';
import { environment } from '../../environments/environment'
import { BookInfo } from '../models/book-info.model';


describe('database.ts', () => {
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
});