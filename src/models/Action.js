import { Column, Entity } from '@themost/jspa';
import { DateTime } from '@themost/jspa';
import { ActionStatusType } from './ActionStatusType';
import { Thing } from './Thing';
import { FunctionContext } from '@themost/data';


@Entity()
export class Action extends Thing {
    
    @Column({
        type: Thing
    })
    result;

    @Column({
        type: DateTime
    })
    startTime;

    @Column({
        type: DateTime
    })
    endTime;

    @Column({
        type: ActionStatusType
    })
    actionStatus;

    @Column({
        type: Text
    })
    target;

    @Column({
        type: Object
    })
    agent;

    @Column({
        type: Object
    })
    owner;

    @Column({
        type: Thing
    })
    instrument;

    @Column({
        type: Thing
    })
    error;

    @Column({
        type: Text,
        length: 36,
        insertable: true,
        updatable: false
    })
    @Formula(async (event) => {
        return new FunctionContext(event.context).chars(36);
    })
    code;

}

export {
    Action
}