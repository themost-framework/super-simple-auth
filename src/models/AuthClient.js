import { DataObject, FunctionContext } from '@themost/data';
import { CascadeType, Column, ColumnDefault, ElementCollection, CollectionTable, Embeddable, Entity, FetchType, Formula, Id, ManyToMany, OneToMany, Table, Text } from '@themost/jspa';

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

    @ElementCollection({
        fetch: FetchType.Lazy,
        targetClass: Text
    })
    @CollectionTable({
        name: 'AuthClientRedirectUris',
        joinColumns: [
            {
                name: 'client',
                referencedColumnName: 'client_id'
            }
        ]
    })
    redirect_uri;

    @ElementCollection({
        fetch: FetchType.Eager,
        targetClass: Text
    })
    @CollectionTable({
        name: 'AuthClientGrantTypes',
        joinColumns: [
            {
                name: 'client',
                referencedColumnName: 'id'
            }
        ]
    })
    grantType;

    @ElementCollection({
        fetch: FetchType.Eager,
        targetClass: Text
    })
    @CollectionTable({
        name: 'AuthClientScopes',
        joinColumns: [
            {
                name: 'client',
                referencedColumnName: 'id'
            }
        ]
        
    })
    scope;

}

export {
    AuthClient
}