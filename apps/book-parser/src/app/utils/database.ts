import { Sequelize } from 'sequelize';

// book_shelf
export const SequelizeConnection = new Sequelize('postgres', 'postgres', 'postgres', {
    dialect: 'postgres',
    host: 'localhost',
});
