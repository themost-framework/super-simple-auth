import { DataContext, EdmMapping } from '@themost/data';
import { CascadeType, Column, ColumnType, Entity, Id, Text, ColumnDefault, Embeddable, EntityListeners, FetchType, Formula, JoinTable, ManyToMany, OneToOne, PostInit, PostInitEvent, PostLoad } from '@themost/jspa';
import { Account, AccountType } from './Account';
import { DataObject } from '@themost/data';

@Entity()
@EntityListeners()
class User extends Account {
    
    constructor() {
        super();
    }

    @Column({
        nullable: false,
        updatable: false,
        insertable: true,
        type: ColumnType.Integer
    })
    @Formula(() => AccountType.User)
    accountType;

    @Column({
        nullable: false,
        type: Boolean
    })
    @ColumnDefault(() => true)
    enabled;

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

@Entity()
@Embeddable()
class UserCredential extends DataObject {
    
    @Id()
    id;

    @Column({
        type: User,
        unique: true
    })
    user;

    @Column({
        type: Text,
        length: 512,
        nullable: false
    })
    userPassword;

    @Column({
        type: ColumnType.Boolean
    })
    @ColumnDefault(() => true)
    userActivated;

    @Column({
        type: ColumnType.DateTime
    })
    badPasswordTime;

    @Column({
        type: ColumnType.Integer
    })
    @ColumnDefault(() => 0)
    badPasswordCount;

    @Column({
        type: ColumnType.DateTime
    })
    expirationDate;

    @Column({
        type: ColumnType.Boolean
    })
    @ColumnDefault(() => false)
    pwdLastSet;

}

export {
    User,
    UserCredential
}
