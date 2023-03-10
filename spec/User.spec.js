import { ExpressDataApplication } from '@themost/express';
import { User } from '../src/models/User';
import { executeInTransaction, getTestApplication, cleanupApplication, cleanupContext } from './TestUtils';
import { Authenticator } from '../src/services/Authenticator';

describe('AuthClient', () => {
    
    /**
     * @type {import("@themost/express").ExpressDataApplication}
     */
    let app;
    /**
     * @type {import("@themost/express").ExpressDataContext}
     */
    let context;
    beforeAll(() => {
        const container = getTestApplication();
        app = container.get(ExpressDataApplication.name);
    });
    afterAll(async () => {
        //
    });
    beforeEach(() => {
        context = app.createContext();
    });
    afterEach(async () => {
        cleanupApplication(app);
        if (context) {
            await context.finalizeAsync();
        }
    });

    it('should create user', async () => {
        await executeInTransaction(context, async () => {
            const newUser = {
                name: 'alexis.rees@example.com',
                description: 'Alexis Rees',
                groups: [
                    {
                        name: 'Administrators'
                    }
                ]
            };
            await context.model(User).silent().save(newUser);
            let user = await context.model(User).asQueryable()
                .where((x) => x.name === 'alexis.rees@example.com')
                .expand((x) => x.groups)
                .silent().getTypedItem();
            expect(user).toBeTruthy();
            expect(user.id).toEqual(newUser.id);
            expect(user.groups).toBeInstanceOf(Array);
            expect(user.groups.length).toBeTruthy();
            expect(user.groups[0].name).toEqual('Administrators');
            context.user = {
                name: 'alexis.rees@example.com'
            }
            user = await context.model(User).asQueryable()
                .where((x) => x.name === 'alexis.rees@example.com')
                .getTypedItem();
            expect(user).toBeTruthy();
        });
    });

    it('should validate user password', async () => {
        await executeInTransaction(context, async () => {
            const newUser = {
                name: 'alexis.rees@example.com',
                description: 'Alexis Rees',
                groups: [
                    {
                        name: 'Administrators'
                    }
                ]
            };
            await context.model(User).silent().save(newUser);
            const user = await context.model(User).asQueryable()
                .where((x) => x.name === 'alexis.rees@example.com')
                .expand((x) => x.groups)
                .silent().getTypedItem();
            await user.silent().setPassword('secret');
  
            await expectAsync(context.application.getService(Authenticator).validateUser(
                context, 'alexis.rees@example.com', 'invalid'
                )).toBeRejectedWithError('Invalid credentials');
            await expectAsync(context.application.getService(Authenticator).validateUser(
                context, 'user1@example.com', 'invalid'
                )).toBeRejectedWithError('Unknown user');
            
        });
    });

})