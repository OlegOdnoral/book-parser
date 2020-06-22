import { Model, Table, PrimaryKey, Column, Unique } from 'sequelize-typescript';

export interface BookInfoI {
    id: string | number;
    title: string;
    author: string;
    publisher: string;
    publicationDate: string;
    language: string;
    subject: string;
    licenseRights: string;
}


@Table({
    tableName: 'book_info',
    timestamps: true
})
export class BookInfo extends Model implements BookInfoI {

    @PrimaryKey
    @Column
    public id: number;

    @Column('text')
    public title: string;
    @Column('text')
    public author: string;
    @Column('text')
    public publisher: string;
    @Column('date')
    public publicationDate: string;
    @Column
    public language: string;
    @Column('text')
    public subject: string;
    @Column('text')
    public licenseRights: string;
}