import { Guid } from '@themost/common';
import { DataObject, FunctionContext } from '@themost/data';
import { Column, Embeddable, Entity, Formula, Id, Text, ColumnType, ColumnDefault } from '@themost/jspa';

@Entity()
@Embeddable()
class AccessToken extends DataObject {
    constructor() {
        super();
    }

    @Column({
        type: Guid,
        length: 36,
        insertable: true,
        updatable: false
    })
    @Id()
    @Formula(async (event) => {
        return new FunctionContext(event.context).newGuid();
    })
    id;

    @Column({
        type: Text,
        length: 1024,
        insertable: true,
        updatable: false
    })
    @Formula(async (event) => {
        return new FunctionContext(event.context).chars(128);
    })
    access_token;

    @Column({
        type: Text,
        length: 16,
        nullable: false
    })
    client_id;

    @Column({
        type: Text,
        length: 80,
        nullable: false
    })
    user_id;

    @Column({
        type: ColumnType.DateTime,
        nullable: true
    })
    expires;

    @Column({
        type: Text,
        length: 1024,
        insertable: true,
        updatable: false
    })
    @Formula(async (event) => {
        return new FunctionContext(event.context).chars(128);
    })
    refresh_token;

    @Column({
        type: Text,
        length: 255,
        nullable: false
    })
    scope;
}

export {
    AccessToken
}