import {Sequelize} from "sequelize-typescript"

import { BookInfo } from '../models/book-info.model';

// book_shelf
export const SequelizeConnection = new Sequelize('postgres', 'postgres', 'postgres', {
    dialect: 'postgres',
    host: 'localhost',
    models: [BookInfo],
    logging: false,
});
