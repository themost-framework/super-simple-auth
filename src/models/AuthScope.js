import { DataObject } from '@themost/data';
import { Column, Entity, Id, Text, Permission, PostInit } from '@themost/jspa';

const AUTH_SCOPES = [{
    name: 'openid',
    description: 'This scope value requests access to iss, aud, exp, iat, and at_hash claims',
}, {
    name: 'profile',
    description: 'This scope value requests access to the end-user\'s default profile claims',
}, {
    name: 'email',
    description: 'This scope value requests access to the email and email_verified claims',
}, {
    name: 'address',
    description: 'This scope value requests access to the address claim',
}, {
    name: 'phone',
    description: 'This scope value requests access to the phone_number and phone_number_verified claims',
}]

@Entity()
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

    // noinspection JSUnusedLocalSymbols
    @PostInit()
    async onPostInit(event) {
        const count = await event.model.asQueryable().silent().count();
        if (count) {
            return;
        }
        await event.model.silent().save(AUTH_SCOPES);
    }
}

export {
    AuthScope
}