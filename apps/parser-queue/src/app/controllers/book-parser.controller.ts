import { readFileSync } from 'fs';
import { DOMParser } from 'xmldom';
import { ConsumeMessage, Replies } from 'amqplib';

import { RabbitConnector } from '../services/rabbit.service';
import { BookInfo, BookInfoI } from '../models/book-info.model';


export interface BookParserClassInput {
    queueName: string,
    rabbitUri: string,
    rabbitUser: string,
    rabbitPassword: string
}

export class BookParser extends RabbitConnector {

    private queueName: string;

    constructor(inputConfig: BookParserClassInput) {
        super(inputConfig.rabbitUri, inputConfig.rabbitUser, inputConfig.rabbitPassword);
        this.queueName = inputConfig.queueName;
    }

    async subscribeOnChannel(): Promise<Replies.Consume> {
        try {
            await this.tryConnect(this.queueName);
        } catch (error) {
            console.error('Rabbit connection issue');
        }

        this.chanel.prefetch(1);

        return await this.chanel.consume(this.queueName, async (msg: ConsumeMessage) => {

            const booInfo = this.parseFile(msg.content.toString());
            let bookWasSaved: BookInfo;
            if(booInfo) bookWasSaved = await this.saveBookInfo(booInfo);
            if (booInfo && bookWasSaved) {
                this.chanel.ack(msg);
            } else {
                this.chanel.reject(msg, false);
            }

        }, { noAck: false })
    }

    async getQueueInfo(): Promise<Replies.AssertQueue> {
        return await this.checkQueue(this.queueName);
    }

    parseFile(pathToFile: string): BookInfoI|null {

        const data = readFileSync(pathToFile);
        if (!data) {
            console.log(pathToFile);
            return null;
        }

        const xmlDoc = new DOMParser().parseFromString(data.toString(), 'text/xml');

        const bookInfoObject = this.getDocumentInfoObjectByTag(xmlDoc);
        if (!bookInfoObject) return null;

        const bookId = this.getDocumentIdByAttribute(bookInfoObject);
        if (bookId === 0 || bookId.toString().length > 5) return null;

        const title = this.getTagValue(bookInfoObject, 'dcterms:title');
        const publisher = this.getTagValue(bookInfoObject, 'dcterms:publisher');
        const publicationDate = this.getTagValue(bookInfoObject, 'dcterms:issued');
        const licenseRights = this.getTagValue(bookInfoObject, 'dcterms:rights');

        const language = this.getTagValueFromContainer(bookInfoObject, 'dcterms:language', 'rdf:value');
        const authors = this.getTagValueFromContainer(bookInfoObject, 'dcterms:creator', 'pgterms:name');
        const subjects = this.getTagValueFromContainer(bookInfoObject, 'dcterms:subject', 'rdf:value');


        const booksInfo: BookInfoI = {
            id: bookId,
            title,
            publisher,
            publicationDate,
            licenseRights,
            language,
            author: authors,
            subject: subjects,
        }
        return booksInfo;
    }

    getDocumentInfoObjectByTag(doc: Document, tagName = 'pgterms:ebook'): Element | null {
        const res = doc.documentElement
            .getElementsByTagName(tagName)
            ?.item(0);
        return res ? res : null;
    }

    getDocumentIdByAttribute(xmlData: Element, attrName = 'rdf:about'): number {
        const idData: Array<string> = xmlData.getAttribute(attrName).split('/');
        const id = idData[idData.length - 1];
        return +id
    }


    getTagValue(xmlData: Element, tagName: string) {
        const res = xmlData
            .getElementsByTagName(tagName)
            ?.item(0)
            ?.textContent;
        return res ? res : null;
    }

    getTagValueFromContainer(xmlData: Element, containerTagName: string, valueTagname: string):  string | null {
        const subjectsArray = xmlData.getElementsByTagName(containerTagName);
        const valuesStringsArray: Array<string> = [];
        if (subjectsArray.length > 0) {
            for (let i = 0; i < subjectsArray.length; i++) {
                const subjectData = subjectsArray.item(i).getElementsByTagName(valueTagname)?.item(0)?.textContent;
                if (subjectData) valuesStringsArray.push(subjectData.trim());
            }
        }
        const res = valuesStringsArray.join(' ').trim()
        return res ? res : null;
    }

    async saveBookInfo(bookInfo: BookInfoI) {
        const recordExist = await BookInfo.findByPk(bookInfo.id);
        return await new BookInfo(bookInfo, { isNewRecord: !recordExist }).save();
    }

}
