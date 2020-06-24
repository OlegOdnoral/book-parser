import { Sequelize, SequelizeOptions } from "sequelize-typescript"
import { isMaster } from 'cluster';

import { BookInfo } from '../models/book-info.model';

export interface SequelizeConnectionConfigI {
    database: string,
    username: string, 
    password?: string, 
    options?: SequelizeOptions
}

export class SequelizeConnection extends Sequelize {
    constructor(connectionConfig: SequelizeConnectionConfigI) {
        super(connectionConfig);
    }

    async connectToDatabase() {
        await this.authenticate()
        await this.sync({ force: isMaster });
    }
}

// export const SequelizeConnection = new Sequelize(
//     environment.dbDatabase,
//     environment.dbUser,
//     environment.dbPassword,
//     {
//         dialect: environment.dbDialect,
//         host: environment.dbHost,
//         models: [BookInfo],
//         logging: false,
//     }
// );

// export const ConnectToDb = async () => {
//     SequelizeConnection.authenticate().then(async () => {
//         await SequelizeConnection.sync({ force: isMaster })
//     }).catch((e: any) => {
//         console.log(e.message)
//     })
// }