import { Sequelize, SequelizeOptions } from "sequelize-typescript"
import { isMaster } from 'cluster';

export interface SequelizeConnectionConfigI {
    database: string,
    username: string,
    password?: string,
    options?: SequelizeOptions
}

export class SequelizeConnection extends Sequelize {
    constructor(connectionConfig: SequelizeConnectionConfigI) {
        const { database, username, password, options } = connectionConfig;
        super(database, username, password, options);
    }

    async connectToDatabase(): Promise<void> {
        return this.authenticate().then((res) => res)
        .catch((error) => {
            console.log(JSON.stringify(error));
        });
    }

    async syncWithModels(): Promise<SequelizeConnection> {
        return this.sync({ force: isMaster });
    }
}
