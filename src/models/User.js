import { DataContext, EdmMapping } from '@themost/data';
import { CascadeType, Column, Entity, EntityListeners, FetchType, Formula, JoinTable, ManyToMany, OneToOne, PostInit, PostInitEvent, PostLoad } from '@themost/jspa';
import { Account, AccountType } from './Account';

@Entity()
@EntityListeners()
class User extends Account {
    
    constructor() {
        super();
    }

    @Column({
        nullable: false,
        updatable: false,
        insertable: true
    })
    @Formula(() => AccountType.User)
    accountType;

    @ManyToMany({
        targetEntity: 'Group',
        cascadeType: CascadeType.Detach,
        fetchType: FetchType.Lazy
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
    groups;

    // noinspection JSUnusedLocalSymbols
    @PostInit()
    async onPostInit(event) {
        const count = await event.model.asQueryable().silent().count();
        if (count) {
            return;
        }
        await event.model.silent().save([
            {
                name: 'anonymous',
                alternateName: 'anonymous',
                accountType: AccountType.User,
                groups: [
                    {
                        name: 'Guests'
                    }
                ]
            }
        ]);
    }

    /**
     * @param {DataContext} context
     * @returns {Promise<User>}
     */
    @EdmMapping.func('Me', 'User')
    static async getMe(context) {
        const username = context.user && context.user.name;
        return await context.model(User).where((x) => x.name === username, {
            username
        }).getTypedItem();
    }

}

export {
    User
}
