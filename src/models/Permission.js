import { Basic, Column, ColumnType, Counter, Embeddable, Entity, FetchType, Formula, GeneratedValue, GenerationType, Id, ManyToOne } from '@themost/jspa';
import { Account } from './Account';
import { User } from './User';
import { Workspace } from './Workspace';

@Entity()
class Permission {
    @Id()
    @Column({
        type: Counter
    })
    @GeneratedValue({
        strategy: GenerationType.Identity
    })
    id;

    @Column({
        nullable: true,
        length: 120,
        type: ColumnType.Text
    })
    privilege;

    @Column({
        nullable: true,
        type: ColumnType.Text,
        length: 120
    })
    parentPrivilege;

    @Column({
        nullable: false,
        type: Account
    })
    account;

    @Column({
        nullable: false,
        type: ColumnType.Text,
        length: 36
    })
    target;

    @Column({
        nullable: false,
        type: ColumnType.Integer
    })
    mask;

    @Column({
        nullable: false,
        type: Workspace
    })
    workspace;

    @Column({
        nullable: false,
        updatable: false,
        type: ColumnType.DateTime
    })
    @Formula(() => {
        return new Date();
    })
    dateCreated;

    @Column({
        nullable: false,
        type: ColumnType.DateTime
    })
    @Formula(() => {
        return new Date();
    })
    dateModified;

    @Column({
        nullable: false,
        updatable: false,
        type: User
    })
    @ManyToOne({
        fetchType: FetchType.Lazy
    })
    createdBy;

    @Column({
        nullable: false,
        type: User
    })
    @ManyToOne({
        fetchType: FetchType.Lazy
    })
    modifiedBy;
}

export {
    Permission
}
