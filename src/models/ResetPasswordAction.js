import { Embeddable, Entity } from '@themost/jspa';
import { UpdateAction } from './UpdateAction';

@Entity()
class ResetPasswordAction extends UpdateAction {

}

export {
    ResetPasswordAction
}