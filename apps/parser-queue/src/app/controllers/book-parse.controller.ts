import { readFileSync } from 'fs';
import { DOMParser } from 'xmldom';
import { ConsumeMessage, Replies, Message } from 'amqplib';

import { RabbitConnector } from '../services/rabbit.service';
import { BookInfo, BookInfoI } from '../models/book-info.model';
import { environment } from '../../environments/environment';

export class BookParser extends RabbitConnector {

    private queueName = environment.rabbitQueueName;

    constructor() {
        super(environment.rabbitUri, environment.rabbitUser, environment.rabbitPassword);
    }

    async subscribeOnChannel(): Promise<Replies.Consume> {
        await this.tryConnect();
        this.chanel.prefetch(1);
        return await this.chanel.consume(this.queueName, async (msg: ConsumeMessage) => {
            const res = await this.parseFile(msg.content.toString());
            if (res) {
                this.chanel.ack(msg);
            } else {
                this.chanel.reject(msg, false);
            }
        }, { noAck: false })
    }

    async getQueueInfo(): Promise<Replies.AssertQueue> {
        return await this.checkQueue(this.queueName);
    }

    private async parseFile(pathToFile: string) {

        const data = readFileSync(pathToFile);
        if (!data) {
            console.log(pathToFile);
            return false;
        }

        const xmlDoc = new DOMParser().parseFromString(data.toString(), 'text/xml');
        const bookInfoObject = xmlDoc.documentElement.getElementsByTagName('pgterms:ebook').item(0);

        const idData: Array<string> = bookInfoObject.getAttribute('rdf:about').split('/');

        const id = idData[idData.length - 1];
        if (id.length > 5) return false;

        const title = bookInfoObject.getElementsByTagName('dcterms:title')?.item(0)?.textContent;
        const publisher = bookInfoObject.getElementsByTagName('dcterms:publisher')?.item(0)?.textContent;
        const publicationDate = bookInfoObject.getElementsByTagName('dcterms:issued')?.item(0)?.textContent;
        const language = bookInfoObject.getElementsByTagName('dcterms:language')?.item(0)?.getElementsByTagName('rdf:value')?.item(0)?.textContent;
        const licenseRights = bookInfoObject.getElementsByTagName('dcterms:rights')?.item(0)?.textContent;

        const authorsArray = bookInfoObject.getElementsByTagName('dcterms:creator');
        const authorsNamesArray: Array<string> = [];
        if (authorsArray.length > 0) {
            for (let i = 0; i < authorsArray.length; i++) {
                const authorData = authorsArray.item(i).getElementsByTagName('pgterms:name')?.item(0)?.textContent;
                if (authorData) authorsNamesArray.push(authorData);
            }
        }

        const subjectsArray = bookInfoObject.getElementsByTagName('dcterms:subject')
        const subjectsStringsArray: Array<string> = [];
        if (subjectsArray.length > 0) {
            for (let i = 0; i < subjectsArray.length; i++) {
                const subjectData = subjectsArray.item(i).getElementsByTagName('rdf:value')?.item(0)?.textContent;
                if (subjectData) subjectsStringsArray.push(subjectData);
            }
        }

        const author = authorsNamesArray.join(' ') ? authorsNamesArray.join(' ') : null;
        const subject = subjectsStringsArray.join(' ') ? subjectsStringsArray.join(' ') : null;

        const booksInfo: BookInfoI = {
            id,
            title: title ? title : null,
            publisher: publisher ? publisher : null,
            publicationDate: publicationDate ? publicationDate : null,
            language: language ? language : null,
            licenseRights: licenseRights ? licenseRights : null,
            author,
            subject,
        }
        return await this.saveBookInfo(booksInfo);

    }

    private async saveBookInfo(bookInfo: BookInfoI) {
        const recordExist = await BookInfo.findByPk(bookInfo.id);
        return await new BookInfo(bookInfo, { isNewRecord: !recordExist }).save();
    }

}
