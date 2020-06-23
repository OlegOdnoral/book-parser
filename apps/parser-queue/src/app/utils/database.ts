import { Sequelize } from "sequelize-typescript"
import { isMaster } from 'cluster';

import { BookInfo } from '../models/book-info.model';
import { environment } from '../../environments/environment';

export const SequelizeConnection = new Sequelize(
    environment.dbDatabase,
    environment.dbUser,
    environment.dbPassword,
    {
        dialect: environment.dbDialect,
        host: environment.dbHost,
        models: [BookInfo],
        logging: false,
    }
);

export const ConnectToDb = async () => {
    SequelizeConnection.authenticate().then(async () => {
        await SequelizeConnection.sync({ force: isMaster })
    }).catch((e: any) => {
        console.log(e.message)
    })
}