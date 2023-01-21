import { DataObject, FunctionContext } from '@themost/data';
import { Column, ElementCollection, CollectionTable, Embeddable, Entity, FetchType, Formula, Id, Text, Permission } from '@themost/jspa';

@Entity()
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
    description;

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

@Entity()
@Embeddable()
@Permission([
    {
        mask: 15,
        type: 'global'
    },
    {
        mask: 15,
        account: 'Administrators',
        type: 'global'
    }
])
class AuthClientCredential extends DataObject {
    
    @Id()
    id;

    @Column({
        type: AuthClient,
        nullable: false,
        unique: true,
        insertable: true,
        updatable: false
    })
    client_id;

    @Column({
        type: Text,
        length: 512,
        nullable: false
    })
    client_secret;

}

export {
    AuthClient
}