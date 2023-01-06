import { Embeddable, Entity } from '@themost/jspa';
import { Thing } from './Thing';

@Entity()
@Embeddable()
class Intangible extends Thing {

}

export {
    Intangible
}