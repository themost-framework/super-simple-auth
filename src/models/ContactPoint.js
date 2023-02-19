import { Column, Entity, Text } from '@themost/jspa';
import { StructuredValue } from './StructuredValue';

@Entity()
class ContactPoint extends StructuredValue {

    @Column({
        type: Text,
        length: 40
    })
    faxNumber;

    @Column({
        type: Text,
        length: 40
    })
    telephone;

    @Column({
        type: Text,
        length: 80
    })
    email;

    @Column({
        type: Text,
        length: 40
    })
    contactType;
}

export {
    ContactPoint
}
