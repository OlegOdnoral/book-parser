import { sep } from 'path';
import { readFile, readFileSync, copyFile } from 'fs';

import { GlobSync } from 'glob';
import { DOMParser } from 'xmldom';


import { BookInfoI, BookInfo } from '../models/book-info.model';

const filesFolder = `${process.cwd()}${sep}rdf-files${sep}cache`;

const getPathToFiles = (): Array<string> => {
    const data = new GlobSync(`${filesFolder}${sep}**${sep}*.rdf`);
    return data.found;
}

export const parseFile = () => {


    const filesPathArray: Array<string> = getPathToFiles();

    //filesPathArray = [filesPathArray[0]];

    const dataForInsert: Array<BookInfoI> = [];

    filesPathArray.forEach((pathToFile: string) => {

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

        const booksInfo: BookInfoI = {
            id,
            title,
            author: authorsNamesArray.join(' '),
            publisher,
            publicationDate,
            language,
            subject: subjectsStringsArray.join(' '),
            licenseRights,
        }
        dataForInsert.push(booksInfo);
        // BookInfo.findByPk(booksInfo.id).then((recordExist) => {
        //     new BookInfo(booksInfo, { isNewRecord: !recordExist }).save();
        // })
        //     .catch(err => console.log(err));
    });

    dataForInsert.forEach((item: BookInfoI) => {
        BookInfo.findByPk(item.id).then((recordExist) => {
            new BookInfo(item, { isNewRecord: !recordExist }).save();
        })
            .catch(err => console.log(err));
    })

    //console.log('Data for insert ', dataForInsert.length);

}