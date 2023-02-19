import { EdmMapping } from '@themost/data';
import {  Column, ColumnType, Entity, Table } from '@themost/jspa';
import { Thing } from './Thing';

const AccountType = {
    User: 0,
    Group: 1
}

@Entity()
@EdmMapping.entityType()
@Table({
    indexes: [
        {
            columnList: [ 'name' ]
        }
    ],
    uniqueConstraints: [
        {
            columnNames: [ 'name' ]
        }
    ]
})
class Account extends Thing {

    constructor() {
        super();
    }

    @Column({
        nullable: false,
        type: ColumnType.Integer
    })
    accountType;

    @Column({
        nullable: false,
        type: ColumnType.Text
    })
    name;
}

export {
    AccountType,
    Account
}
