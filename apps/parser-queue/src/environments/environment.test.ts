import { EnvironmentI } from './environment.interface';

export const environment: EnvironmentI = {
  production: true,
  rabbitUri: 'amqp://localhost:5672',
  rabbitUser: 'guest',
  rabbitPassword: 'guest',
  rabbitQueueName: 'books_for_parse',
  dbDialect: 'postgres',
  dbHost: 'localhost',
  dbDatabase: 'postgres',
  dbUser: 'postgres',
  dbPassword: 'postgres',
  dbBookInfoTable: 'book_info_test'
};