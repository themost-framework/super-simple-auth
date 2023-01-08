import { Embeddable, Entity } from '@themost/jspa';
import { Thing } from './Thing';

@Entity()
@Embeddable()
class Workspace extends Thing {
   constructor() {
       super();
   }
}

export {
    Workspace
}
