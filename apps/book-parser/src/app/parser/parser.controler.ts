import { sep } from 'path';

import { Glob } from 'glob';
import { RabbitConnector } from '../queue/rabbit.service';


const filesFolder = `${process.cwd()}${sep}rdf-files${sep}cache`;

export class QueueSender extends RabbitConnector {
    private queueName = 'books_for_parse';

    constructor() {
        super('amqp://localhost:5672', 'guest', 'guest');
    }

    getPathToFiles = () => {
        this.tryConnect();
        new Glob(`${filesFolder}${sep}**${sep}*.rdf`, (err: Error, matches: string[]) => {
            //matches = [matches[0]];
            matches.forEach((item: string) => this.publishToQueue(this.queueName, item));
        });
    }
}
