import { EnvironmentI } from './environment.interface';

export const environment: EnvironmentI = {
  production: false,
  rabbitUri: 'amqp://localhost:5672',
  rabbitUser: 'guest',
  rabbitPassword: 'guest',
  rabbitQueueName: 'books_for_parse',
};
