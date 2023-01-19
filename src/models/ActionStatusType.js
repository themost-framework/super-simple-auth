import { Entity, Inheritance, InheritanceType, Permission, PostInit } from '@themost/jspa';
import { Enumeration } from './Enumeration';

const ActionStatusTypes = [
    {
        "name": "Potential",
        "alternateName": "PotentialActionStatus",
        "description": "A description of an action that is supported.",
        "url": "http://schema.org/PotentialActionStatus"
    },
    {
        "name": "Active",
        "alternateName": "ActiveActionStatus",
        "description": "An in-progress action (e.g, while watching the movie, or driving to a location).",
        "url": "http://schema.org/ActiveActionStatus"
    },
    {
        "name": "Paused",
        "alternateName": "PausedActionStatus",
        "description": "An action that has been paused.",
        "url": "https://themost.io/schemas/PausedActionStatus"
    },
    {
        "name": "Failed",
        "alternateName": "FailedActionStatus",
        "description": "An action that failed to complete.",
        "url": "http://schema.org/FailedActionStatus"
    },
    {
        "name": "Completed",
        "alternateName": "CompletedActionStatus",
        "description": "An action that has already taken place.",
        "url": "http://schema.org/CompletedActionStatus"
    },
    {
        "name": "Cancelled",
        "alternateName": "CancelledActionStatus",
        "description": "An action that has been cancelled.",
        "url": "https://themost.io/schemas/CancelledActionStatus"
    }
]

@Entity()
@Inheritance({
    strategy: InheritanceType.TablePerClass
})
@Permission([
    {
        mask: 15,
        type: 'global'
    },
    {
        mask: 1,
        account: '*',
        type: 'global'
    }
])
class ActionStatusType extends Enumeration {
    @PostInit()
    async onPostInit(event) {
        const count = await event.model.asQueryable().silent().count();
        if (count) {
            return;
        }
        await event.model.silent().save(ActionStatusTypes);
    }
}

export {
    ActionStatusType
}