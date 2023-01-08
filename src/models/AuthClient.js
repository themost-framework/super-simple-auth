import { DataObject, FunctionContext } from '@themost/data';
import { CascadeType, Column, ColumnDefault, Embeddable, Entity, FetchType, Formula, Id, ManyToMany, OneToMany, Text } from '@themost/jspa';

@Entity()
@Embeddable()
class AuthClient extends DataObject {

    constructor() {
        super();
    }

    @Column({
        type: Text,
        length: 16,
        insertable: true,
        updatable: false
    })
    @Id()
    @Formula(async (event) => {
        return new FunctionContext(event.context).numbers(16);
    })
    client_id;

    @Column({
        type: Text,
        nullable: false
    })
    name;

    @Column({
        type: Text,
        nullable: false
    })
    name;

    @ManyToMany({
        type: Text,
        cascadeType: CascadeType.Remove,
        fetch: FetchType.Eager
    })
    redirect_uri;

    @ManyToMany({
        type: Text,
        cascadeType: CascadeType.Remove,
        fetch: FetchType.Eager
    })
    grantType;

    @ManyToMany({
        type: Text,
        cascadeType: CascadeType.Remove,
        fetch: FetchType.Eager
    })
    scope;

}

export {
    AuthClient
}