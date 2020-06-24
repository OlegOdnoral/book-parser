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

  let dbConnection: SequelizeConnection;

  beforeEach(async() => {
    dbConnection = new SequelizeConnection(sequelizeConnectionConfig);
  })

  it('should successfyly connect to database', async () => {
    expect.assertions(1);
    await expect(dbConnection.connectToDatabase()).resolves.toEqual(undefined);
  });

  it('should reject connect to database if something wrong', async () => {
    const newDbName = `${dbConnection.options.database}_tmp`;
    dbConnection.options.database = newDbName;
    try {
      await dbConnection.connectToDatabase();
    } catch (error) {
      expect(error.name).toEqual('SequelizeConnectionError');
    }
  });

});