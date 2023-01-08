import { ExpressDataApplication } from '@themost/express';
import { getApplication } from '../src';
import { AuthClient } from '../src/models/AuthClient';
import { executeInTransaction } from './TestUtils';
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
        const container = getApplication();
        app = container.get(ExpressDataApplication.name);
        context = app.createContext();
    });
    afterAll(async () => {
        await context.finalizeAsync();
    });

    it('should create item', async () => {
        await executeInTransaction(context, async () => {
            /**
             * @type {AuthClient}
             */
            const newItem = {
                name: 'Test Client'
            };
            await context.model(AuthClient).silent().insert(newItem);
            expect(newItem.client_id).toBeTruthy();
            const client_id = newItem.client_id;
            const client = await context.model(AuthClient).asQueryable().where((x) => {
                return x.client_id === client_id;
            }, {
                client_id
            }).silent().getItem();
            expect(client).toBeTruthy();
            expect(client.name).toEqual('Test Client');
        });
    });

});