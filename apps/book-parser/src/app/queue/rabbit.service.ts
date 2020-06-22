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
    chanel: ConfirmChannel;

    constructor(uri: string, user: string, password: string) {
        this._uri = uri;//process.env.RABBIT_URI || 'amqp://localhost:5672';
        this._user = user;//process.env.RABBIT_USER || 'guest';
        this._password = password;//process.env.RABBIT_PASSSWORD || 'guest';

    }

    protected async tryConnect() {
        try {
            this._connection = await connect(this._uri, credentials.plain(this._user, this._password));
            this.chanel = await this._connection.createConfirmChannel();
        } catch (error) {
            console.log('Can`t connect to rebbit');
        }
    }

    protected async disconnect(): Promise<void> {
        await this.chanel.close();
        return this._connection.close();
    }

    protected async clearQueue(queueName: string): Promise<Replies.PurgeQueue> {
        return await this.chanel.purgeQueue(queueName);
    }

    protected async publishToQueue(queueName: string, data: string): Promise<boolean> {
        await this.chanel.assertQueue(queueName, { durable: true });
        return this.chanel.sendToQueue(queueName, Buffer.from(data), { persistent: true });
    }

    protected async subscribeOnChannelAB(queueName: string, ): Promise<Replies.Consume> {
        this.chanel.prefetch(1);
        return await this.chanel.consume(queueName, (msg: ConsumeMessage) => {
            console.log(msg.content.toString());
            this.chanel.ack(msg);
        }, { noAck: false })
    }

    protected async checkQueue(queueName: string): Promise<Replies.AssertQueue> {
        return await this.chanel.checkQueue(queueName);
    }

}