import { Dialect } from 'sequelize/types/lib/sequelize';

export interface EnvironmentI {
    production: boolean;
    rabbitUri: string;
    rabbitUser: string;
    rabbitPassword: string;
    rabbitQueueName: string;
    dbDialect: Dialect;
    dbHost: string;
    dbDatabase: string;
    dbUser: string;
    dbPassword: string;

    dbBookInfoTable: string;
}