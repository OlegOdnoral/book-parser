import { connect, Connection, credentials, ConsumeMessage, ConfirmChannel } from 'amqplib';

let connectionChannel: ConfirmChannel;
const queueName = 'books_for_parse';

const URI = 'amqp://rabbit:rabbit@127.0.0.1:5672/books_parser';


export const connectToRabbit = async () => {
    try {
        const _connection: Connection = await connect({
            hostname: '127.0.0.1',
            port: 5672,
        }, credentials.plain('guest', 'guest'));
        connectionChannel = await _connection.createConfirmChannel();
    } catch (error) {
        console.log(error);
    }
}

export const subscribeOnChannel = async () => {
    connectionChannel.prefetch(1);
    connectionChannel.consume(queueName, (msg: ConsumeMessage) => {
        console.log(msg.content.toString());
        connectionChannel.ack(msg);
    }, { noAck: false })
}

export const clear = async () => {
    connectionChannel.purgeQueue(queueName);
}

export const publishToQueue = async (data: string) => {

    connectionChannel.assertQueue(queueName, { durable: true });
    connectionChannel.sendToQueue(queueName, Buffer.from(data), { persistent: true });
    //     console.log(dataWasInsert);
    //     connectionChannel.prefetch(1);
    //     connectionChannel.consume(queueName, (msg: ConsumeMessage) => {
    //         console.log(msg);
    //     });
    //     console.log(await connectionChannel.checkQueue('books_for_parse'));
}