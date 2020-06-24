import { BookParserClassInput, BookParser } from './book-parser.controller';
import { environment } from '../../environments/environment';

import { sep } from 'path';
import { GlobSync } from 'glob';
import { readFileSync } from 'fs';

describe('book-parser.controller.ts', () => {

    const filesFolder = `${process.cwd()}${sep}rdf-files${sep}test_cases`;

    let bookParserInstance: BookParser;
    let pathToFiles: string[];
    let fileData: Buffer;
    let xmlDoc: Document;
    let bookInfo: Element;

    beforeAll(() => {
        pathToFiles = new GlobSync(`${filesFolder}${sep}**${sep}*.rdf`).found;
        fileData = readFileSync(pathToFiles[0]);
        xmlDoc = new DOMParser().parseFromString(fileData.toString(), 'text/xml');
    })


    beforeEach(() => {

        const bookParserConfig: BookParserClassInput = {
            queueName: environment.rabbitQueueName,
            rabbitUri: environment.rabbitUri,
            rabbitUser: environment.rabbitUser,
            rabbitPassword: environment.rabbitPassword,
        };
        bookParserInstance = new BookParser(bookParserConfig);
        bookInfo = bookParserInstance.getDocumentInfoObjectByTag(xmlDoc);
    });

    it('Should return valid book id', () => {
        const bookId = bookParserInstance.getDocumentIdByAttribute(bookInfo);
        expect(typeof bookId).toBe('number');
        expect(bookId).toBeGreaterThan(0);
    })

    it('Should return valid value by tag name', () => {
        const publisher = bookParserInstance.getTagValue(bookInfo, 'dcterms:publisher');
        expect(publisher).not.toBeNull();
        expect(publisher).toBe('Project Gutenberg');
    })

    it('Should return valid value by container name', () => {
        const creator = bookParserInstance.getTagValueFromContainer(bookInfo, 'dcterms:creator', 'pgterms:name');
        expect(creator).not.toBeNull();
        expect(creator).toBe('Jefferson, Thomas');
    })

})