import {Column, Entity, Text} from '@themost/jspa';
import { Party } from './Party';
@Entity()
class Person extends Party {
    @Column({
        type: Text,
        nullable: false
    })
    givenName;

    @Column({
        type: Text,
        nullable: false
    })
    familyName;

    @Column({
        type: Text,
        nullable: false
    })
    middleName;

    @Column({
        type: Text,
        nullable: false
    })
    nickName;

    @Column({
        type: Text,
        nullable: false,
        size: 10
    })
    birthDate;

    @Column({
        type: 'User',
        nullable: false,
        size: 10
    })
    user;
}

export {
    Person
}