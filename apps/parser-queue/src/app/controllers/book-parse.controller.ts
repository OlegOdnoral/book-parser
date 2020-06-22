import { RabbitConnector } from '../services/rabbit.service';

const queueName = 'books_for_parse';

const rabbitConnector = new RabbitConnector(
    'amqp://localhost:5672', 
    'guest', 
    'guest'
    );

rabbitConnector.tryConnect();

export const checkChannel = () => {
    
}