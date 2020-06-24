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
        this._uri = uri;
        this._user = user;
        this._password = password;

    }

    protected async tryConnect(queueName: string) {
        this._connection = await connect(this._uri, credentials.plain(this._user, this._password));
        this.chanel = await this._connection.createConfirmChannel();
        this.chanel.assertQueue(queueName, {durable: true});
        return this.chanel.checkQueue(queueName);
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


    protected async subscribeOnChannelAB(queueName: string,): Promise<Replies.Consume> {
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
