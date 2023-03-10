import {
    CascadeType,
    Column,
    ColumnType,
    Entity,
    FetchType,
    Formula,
    JoinTable,
    ManyToMany,
    PostInit
} from '@themost/jspa';
import { Account, AccountType } from './Account';
import { EdmMapping } from '@themost/data';

@Entity()
@EdmMapping.entityType()
class Group extends Account {
    @Formula(() => AccountType.Group)
    @Column({
        nullable: false,
        updatable: false,
        type: ColumnType.Integer
    })
    @Formula(() => AccountType.Group)
    accountType;

    @ManyToMany({
        targetEntity: Account,
        fetchType: FetchType.Lazy,
        cascadeType: CascadeType.Detach
    })
    @JoinTable({
        name: 'GroupMembers'
    })
    @JoinTable({
        name: 'GroupMembers',
        joinColumns: [
            {
                name: 'object',
                referencedColumnName: 'id'
            }
        ],
        inverseJoinColumns: [
            {
                name: 'value',
                referencedColumnName: 'id'
            }
        ]
    })
    members;

    // noinspection JSUnusedLocalSymbols
    @PostInit()
    async onPostInit(event) {
        const count = await event.model.asQueryable().silent().count();
        if (count) {
            return;
        }
        await event.model.silent().save([
            {
                name: 'Administrators',
                alternateName: 'administrators',
                accountType: AccountType.Group
            },
            {
                name: 'Users',
                alternateName: 'users',
                accountType: AccountType.Group
            },
            {
                name: 'Guests',
                alternateName: 'guests',
                accountType: AccountType.Group
            }
        ]);
    }
}

export {
    Group
}
