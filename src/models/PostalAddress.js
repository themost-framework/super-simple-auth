import { Column, Embeddable, Entity, Text } from '@themost/jspa';
import { ContactPoint } from './ContactPoint';

@Entity()
@Embeddable()
class PostalAddress extends ContactPoint {
    @Column({
        type: Text,
        length: 40
    })
    postOfficeBoxNumber;

    @Column({
        type: Text,
        length: 255
    })
    streetAddress;

    @Column({
        type: Text,
        length: 255
    })
    addressRegion;

    @Column({
        type: Text,
        length: 40
    })
    postalCode;

    @Column({
        type: Text,
        length: 255
    })
    addressLocality;
}

export {
    PostalAddress
}