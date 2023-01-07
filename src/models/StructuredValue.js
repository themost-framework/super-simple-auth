import { Entity, Embeddable } from '@themost/jspa';
import { Intangible } from './Intangible';

@Entity()
@Embeddable()
class StructuredValue extends Intangible {
}

export {
    StructuredValue
}