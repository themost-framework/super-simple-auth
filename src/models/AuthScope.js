import { DataObject } from '@themost/data';
import { Counter, Column, Embeddable, Entity, Id, Text, Permission } from '@themost/jspa';

@Entity()
@Embeddable()
@Permission([
    {
        mask: 15,
        type: 'global'
    },
    {
        mask: 1,
        account: '*',
        type: 'global'
    },
    {
        mask: 15,
        account: 'Administrators',
        type: 'global'
    }
])
class AuthScope extends DataObject {
    constructor() {
        super();
    }

    @Id()
    id;

    @Column({
        type: Text,
        nullable: false,
        unique: true
    })
    name;

    @Column({
        type: Text,
        nullable: true,
    })
    description;

    @Column({
        type: Text,
        nullable: true,
    })
    url;
}

export {
    AuthScope
}