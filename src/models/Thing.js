import { DataObject } from '@themost/data';
import { Column, Entity, GeneratedValue, GenerationType, Id, Table, Text, Formula, ManyToOne, FetchType, ColumnDefault, ColumnType, Embeddable } from '@themost/jspa';

@Entity()
@Table()
@Embeddable()
class Thing extends DataObject {

    constructor() {
        super();
    }

    @Id()
    id;

    @Column({
        type: Text
    })
    name;

    @Column({
        type: Text
    })
    alternateName;

    @Column({
        type: Text
    })
    description;

    @Column({
        type: Text,
        updatable: false
    })
    @Formula((event) => {
        return event.model.name;
    })
    additionalType;

    @Column({
        type: Text
    })
    sameAs;

    @Column({
        type: Text
    })
    url;

    @Column({
        type: Text
    })
    identifier;

    @Column({
        type: Text
    })
    image;

    @Column({
        nullable: false,
        updatable: false,
        type: ColumnType.DateTime
    })
    @ColumnDefault(() => new Date())
    dateCreated;

    @Column({
        nullable: false,
        type: ColumnType.DateTime
    })
    @Formula(() => new Date())
    dateModified;

    @Column({
        nullable: true,
        updatable: false,
        type: 'User'
    })
    @ManyToOne({
        fetchType: FetchType.Lazy
    })
    @Formula((event) => {
        const user = event.context && (event.context.interactiveUser || event.context.user);
        if (user && user.name) {
            if (user.name === 'anonymous') {
                return null;
            }
            return {
                name: user.name
            };
        }
        return null;
    })
    createdBy;

    @Column({
        nullable: true,
        type: 'User'
    })
    @ManyToOne({
        fetchType: FetchType.Lazy
    })
    @Formula((event) => {
        const user = event.context && (event.context.interactiveUser || event.context.user);
        if (user && user.name) {
            if (user.name === 'anonymous') {
                return null;
            }
            return {
                name: user.name
            };
        }
        return null;
    })
    modifiedBy;
}

export {
    Thing
}