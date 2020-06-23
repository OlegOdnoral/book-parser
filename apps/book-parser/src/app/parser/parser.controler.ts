import { sep } from 'path';

import { Glob } from 'glob';
import { RabbitConnector } from '../queue/rabbit.service';
import { environment } from '../../environments/environment';


const filesFolder = `${process.cwd()}${sep}rdf-files${sep}cache`;

export class QueueSender extends RabbitConnector {
    private queueName = environment.rabbitQueueName;

    constructor() {
        super(environment.rabbitUri, environment.rabbitUser, environment.rabbitPassword);
    }

    getPathToFiles = () => {
        this.tryConnect();
        new Glob(`${filesFolder}${sep}**${sep}*.rdf`, (err: Error, matches: string[]) => {
            matches.forEach((item: string) => this.publishToQueue(this.queueName, item));
        });
    }
}
