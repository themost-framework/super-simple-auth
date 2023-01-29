import { DataContext, EdmMapping } from '@themost/data';
import { CascadeType, Column, ColumnType, Entity, Id, Text, ColumnDefault, Embeddable, EntityListeners, FetchType, Formula, JoinTable, ManyToMany, OneToOne, PostInit, PostInitEvent, PostLoad } from '@themost/jspa';
import { Account, AccountType } from './Account';
import { DataObject } from '@themost/data';
import crypto from 'crypto';
import { Person } from './Person';
import passwordValidator from 'password-validator';

@Entity()
@EntityListeners()
@EdmMapping.entityType()
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

    @Column({
        type: Person
    })
    profile;

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

    async setPassword(newPassword) {
        
        const userPassword = `{md5}${crypto.createHash('md5').update(newPassword).digest('hex')}`;
        const user = this.id;
        const badPasswordCount = 0;
        const badPasswordTime = null;
        await this.context.model(UserCredential).silent(this.getModel().isSilent()).save({
            user,
            userPassword,
            badPasswordCount,
            badPasswordTime
        });
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
