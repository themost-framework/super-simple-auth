import { ExpressDataApplication } from '@themost/express';
import { AuthScope } from '../src/models';
import { AuthClient } from '../src/models/AuthClient';
import { executeInTransaction, getTestApplication, cleanupApplication } from './TestUtils';
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

    it('should add client', async () => {
        await executeInTransaction(context, async () => {
            /**
             * @type {AuthClient}
             */
            const newItem = {
                name: 'Test Client',
                description: 'Test Client Application',
                redirect_uri: [
                    'http://localhost:3000/*',
                    'https://api.example.com/*',
                ]
            };
            await context.model(AuthClient).silent().insert(newItem);
            expect(newItem.client_id).toBeTruthy();
            const client_id = newItem.client_id;
            const client = await context.model(AuthClient).asQueryable().where((x) => {
                return x.client_id === client_id;
            }, {
                client_id
            }).expand((x) => x.redirect_uri).silent().getItem();
            expect(client).toBeTruthy();
        });
    });

    it('should get scopes', async () => {
        await executeInTransaction(context, async () => {
            const scopes = await context.model(AuthScope).asQueryable().silent().getItems();
            expect(scopes).toBeInstanceOf(Array);
            expect(scopes.length).toBeGreaterThan(0);
        });
    });

});