import { Entity, Embeddable } from '@themost/jspa';
import { Intangible } from './Intangible';

@Entity()
class StructuredValue extends Intangible {
}

export {
    StructuredValue
}