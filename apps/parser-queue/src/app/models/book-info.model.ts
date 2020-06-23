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
    tableName: 'book_info_test',
    timestamps: true,
    indexes: [
        {
            name: 'title_index',
            fields: [{ name: 'title', order: 'ASC', collate: 'default' }],
            using: 'BTREE',

        },
        {
            name: 'author_index',
            fields: [{ name: 'author', order: 'ASC', collate: 'default' }],
            using: 'BTREE',
        },
        {
            name: 'publicationDate_index',
            fields: [{ name: 'publicationDate', order: 'ASC' }],
            using: 'BTREE',
        },
    ]
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