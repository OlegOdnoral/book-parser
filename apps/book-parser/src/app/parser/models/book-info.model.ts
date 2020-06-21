import { Model, Table, PrimaryKey, Column } from 'sequelize-typescript';

export interface BookInfoI {
    id: string | number;
    title: string;
    author: string;
    publisher: string;
    publication_date: string;
    language: string;
    subject: string;
    license_rights: string;
}

@Table({
    tableName: 'books_info',
    timestamps: true
})
export class BookInfo extends Model implements BookInfoI {

    @PrimaryKey
    @Column
    public id!: number;

    @Column
    public title: string;
    @Column
    public author: string;
    @Column
    public publisher: string;
    @Column
    public publication_date: string;
    @Column
    public language: string;
    @Column
    public subject: string;
    @Column
    public license_rights: string;
}