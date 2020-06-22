import {Sequelize} from "sequelize-typescript"

import { BookInfo } from '../models/book-info.model';

// book_shelf
export const SequelizeConnection = new Sequelize('postgres', 'postgres', 'postgres', {
    dialect: 'postgres',
    host: 'localhost',
    models: [BookInfo],
    logging: false,
});

export const ConnectToDb = () => {
    SequelizeConnection.authenticate().then(async () => {
        //console.log("database connected")
        try {
            await SequelizeConnection.sync({ force: true });
        } catch (error) {
            console.log(error.message)
        }
    }).catch((e: any) => {
        console.log(e.message)
    })
}