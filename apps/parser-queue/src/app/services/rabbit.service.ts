import {
    connect,
    Connection,
    credentials,
    ConsumeMessage,
    ConfirmChannel,
    Replies
} from 'amqplib';

export class RabbitConnector {

    private _uri: string;
    private _user: string;
    private _password: string;

    private _connection: Connection;
    private _chanel: ConfirmChannel;

    constructor(uri: string, user: string, password: string) {
        this._uri = uri;//process.env.RABBIT_URI || 'amqp://localhost:5672';
        this._user = user;//process.env.RABBIT_USER || 'guest';
        this._password = password;//process.env.RABBIT_PASSSWORD || 'guest';

    }

    protected async tryConnect() {
        try {
            this._connection = await connect(this._uri, credentials.plain(this._user, this._password));
            this._chanel = await this._connection.createConfirmChannel();
        } catch (error) {
            console.log('Can`t connect to rebbit');
        }
    }

    protected async disconnect(): Promise<void> {
        await this._chanel.close();
        return this._connection.close();
    }

    protected async clearQueue(queueName: string): Promise<Replies.PurgeQueue> {
        return await this._chanel.purgeQueue(queueName);
    }

    protected async publishToQueue(queueName: string, data: string): Promise<boolean> {
        await this._chanel.assertQueue(queueName, { durable: true });
        return this._chanel.sendToQueue(queueName, Buffer.from(data), { persistent: true });
    }

    protected async subscribeOnChannelAB(queueName: string, ): Promise<Replies.Consume> {
        this._chanel.prefetch(1);
        return await this._chanel.consume(queueName, (msg: ConsumeMessage) => {
            console.log(msg.content.toString());
            this._chanel.ack(msg);
        }, { noAck: false })
    }

    protected async checkQueue(queueName: string): Promise<Replies.AssertQueue> {
        return await this._chanel.checkQueue(queueName);
    }

    protected get chanel(): ConfirmChannel {
        return this._chanel;
    }

}


// export const connectToRabbit = async () => {
//     try {
//         const _connection: Connection = await connect({
//             hostname: '127.0.0.1',
//             port: 5672,
//         }, credentials.plain('guest', 'guest'));
//         connectionChannel = await _connection.createConfirmChannel();
//     } catch (error) {
//         console.log(error);
//     }
// }

// export const subscribeOnChannel = async () => {
//     connectionChannel.prefetch(1);
//     connectionChannel.consume(queueName, (msg: ConsumeMessage) => {
//         console.log(msg.content.toString());
//         connectionChannel.ack(msg);
//     }, { noAck: false })
// }

// export const clear = async () => {
// }

// export const publishToQueue = async (data: string) => {

//     connectionChannel.assertQueue(queueName, { durable: true });
//     connectionChannel.sendToQueue(queueName, Buffer.from(data), { persistent: true });
//     //connectionChannel.close();
//     //     console.log(dataWasInsert);
//     //     connectionChannel.prefetch(1);
//     //     connectionChannel.consume(queueName, (msg: ConsumeMessage) => {
//     //         console.log(msg);
//     //     });
//     //     console.log(await connectionChannel.checkQueue('books_for_parse'));
// }