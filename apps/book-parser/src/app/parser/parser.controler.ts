import { sep } from 'path';
import { readFile, readFileSync } from 'fs';
import { fork, isMaster, isWorker } from 'cluster';
import { cpus } from 'os';

import { GlobSync } from 'glob';
import { DOMParser } from 'xmldom';


const filesFolder = `${process.cwd()}${sep}rdf-files${sep}cache${sep}epub`;

const getPathToFiles = (): Array<string> => {
    const data = new GlobSync(`${filesFolder}${sep}**${sep}*.rdf`);
    return data.found;
}

export const parseFileSync = () => {

    const filesPathArray: Array<string> = getPathToFiles();

    //filesPathArray = [filesPathArray[0]];

    filesPathArray.map((pathToFile: string) => {
        const data = readFileSync(pathToFile);

        const xmlDoc = new DOMParser().parseFromString(data.toString(), 'text/xml');
        const bookInfoObject = xmlDoc.documentElement.getElementsByTagName('pgterms:ebook').item(0);

        const idData: Array<string> = bookInfoObject.getAttribute('rdf:about').split('/');

        const id = idData[idData.length - 1];
        const title = bookInfoObject.getElementsByTagName('dcterms:title').item(0).textContent;
        const publisher = bookInfoObject.getElementsByTagName('dcterms:publisher').item(0).textContent;
        const issued = bookInfoObject.getElementsByTagName('dcterms:issued').item(0).textContent;
        const language = bookInfoObject.getElementsByTagName('dcterms:language').item(0).getElementsByTagName('rdf:value').item(0).textContent;
        const licenseRights = bookInfoObject.getElementsByTagName('dcterms:rights').item(0).textContent;

        const authorsArray = bookInfoObject.getElementsByTagName('dcterms:creator');
        const authorsNamesArray: Array<string> = [];
        for (let i = 0; i < authorsArray.length; i++) {
            authorsNamesArray.push(authorsArray.item(i).getElementsByTagName('pgterms:name').item(0).textContent);
        }

        const subjectsArray = bookInfoObject.getElementsByTagName('dcterms:subject')
        const subjectsStringsArray: Array<string> = [];
        for (let i = 0; i < subjectsArray.length; i++) {
            subjectsStringsArray.push(subjectsArray.item(i).getElementsByTagName('rdf:value').item(0).textContent);
        }
        const booksInfo = {
            id,
            title,
            authors: JSON.stringify(authorsNamesArray),
            publisher,
            issued,
            language,
            subjects: JSON.stringify(subjectsStringsArray),
            licenseRights,
        }
        console.table(booksInfo);
    });
}

export const parseFile = () => {


    let filesPathArray: Array<string> = getPathToFiles();

    filesPathArray = [filesPathArray[0]];

    filesPathArray.map((pathToFile: string) => {
        readFile(
            pathToFile,
            (err: NodeJS.ErrnoException, data: Buffer) => {
                const xmlDoc = new DOMParser().parseFromString(data.toString(), 'text/xml');
                const bookInfoObject = xmlDoc.documentElement.getElementsByTagName('pgterms:ebook').item(0);

                const idData: Array<string> = bookInfoObject.getAttribute('rdf:about').split('/');

                const id = idData[idData.length - 1];
                const title = bookInfoObject.getElementsByTagName('dcterms:title').item(0).textContent;
                const publisher = bookInfoObject.getElementsByTagName('dcterms:publisher').item(0).textContent;
                const issued = bookInfoObject.getElementsByTagName('dcterms:issued').item(0).textContent;
                const language = bookInfoObject.getElementsByTagName('dcterms:language').item(0).getElementsByTagName('rdf:value').item(0).textContent;
                const licenseRights = bookInfoObject.getElementsByTagName('dcterms:rights').item(0).textContent;

                const authorsArray = bookInfoObject.getElementsByTagName('dcterms:creator');
                const authorsNamesArray: Array<string> = [];
                for (let i = 0; i < authorsArray.length; i++) {
                    authorsNamesArray.push(authorsArray.item(i).getElementsByTagName('pgterms:name').item(0).textContent);
                }

                const subjectsArray = bookInfoObject.getElementsByTagName('dcterms:subject')
                const subjectsStringsArray: Array<string> = [];
                for (let i = 0; i < subjectsArray.length; i++) {
                    subjectsStringsArray.push(subjectsArray.item(i).getElementsByTagName('rdf:value').item(0).textContent);
                }
                const booksInfo = {
                    id,
                    title,
                    authors: JSON.stringify(authorsNamesArray),
                    publisher,
                    issued,
                    language,
                    subjects: JSON.stringify(subjectsStringsArray),
                    licenseRights,
                }
                console.table(booksInfo);
            })
    });



    // readFile(
    //     `${process.cwd()}/rdf-files/cache/epub/1/pg1.rdf`,
    //     (err: NodeJS.ErrnoException, data: Buffer) => {
    //         const xmlDoc = new DOMParser().parseFromString(data.toString(), 'text/xml');
    //         const bookInfoObject = xmlDoc.documentElement.getElementsByTagName('pgterms:ebook').item(0);

    //         const idData: Array<string> = bookInfoObject.getAttribute('rdf:about').split('/');

    //         const id = idData[idData.length-1];
    //         const title = bookInfoObject.getElementsByTagName('dcterms:title').item(0).textContent;
    //         const publisher = bookInfoObject.getElementsByTagName('dcterms:publisher').item(0).textContent;
    //         const issued = bookInfoObject.getElementsByTagName('dcterms:issued').item(0).textContent;
    //         const language = bookInfoObject.getElementsByTagName('dcterms:language').item(0).getElementsByTagName('rdf:value').item(0).textContent;
    //         const licenseRights = bookInfoObject.getElementsByTagName('dcterms:rights').item(0).textContent;

    //         const authorsArray = bookInfoObject.getElementsByTagName('dcterms:creator');
    //         const authorsNamesArray: Array<string> = [];
    //         for(let i = 0; i < authorsArray.length; i++) {
    //             authorsNamesArray.push(authorsArray.item(i).getElementsByTagName('pgterms:name').item(0).textContent);
    //         }

    //         const subjectsArray = bookInfoObject.getElementsByTagName('dcterms:subject')
    //         const subjectsStringsArray: Array<string> = [];
    //         for(let i = 0; i < subjectsArray.length; i++) {
    //             subjectsStringsArray.push(subjectsArray.item(i).getElementsByTagName('rdf:value').item(0).textContent);
    //         }
    //         const booksInfo = {
    //             id,
    //             title,
    //             authors: JSON.stringify(authorsNamesArray),
    //             publisher,
    //             issued,
    //             language,
    //             subjects: JSON.stringify(subjectsStringsArray),
    //             licenseRights,
    //         }
    //         console.table(booksInfo);
    //     })
}