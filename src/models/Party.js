import {Column, Embeddable, Embedded, Entity, Text} from '@themost/jspa';
import { PostalAddress } from './PostalAddress';
import { Thing } from './Thing';
@Entity()
@Embeddable()
class Party extends Thing {

    @Embedded()
    @Column({
        type: PostalAddress
    })
    address;

    @Column({
        type: Text,
        length: 40
    })
    email;
}

export {
    Party
}
