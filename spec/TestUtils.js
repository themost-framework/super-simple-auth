import { DataConfigurationStrategy } from "@themost/data";
import { ExpressDataApplication } from "@themost/express";
import { SqliteAdapter } from "@themost/sqlite";
import { getApplication } from "../src";

class CancelTransactionError extends Error {
    constructor() {
        super();
    }
}

/**
 * Wraps DataAdapter.executeInTransaction() for using in testing environments
 * @param {import("@themost/data").DataContext} context
 * @param {function():Promise<void>} func
 * @returns {Promise<void>}
 */
function executeInTransaction(context, func) {
    return new Promise((resolve, reject) => {
        // clear cache
        const configuration = context.getConfiguration();
        Object.defineProperty(configuration, 'cache', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: { }
        });
        // start transaction
        context.db.executeInTransaction((cb) => {
            try {
                func().then(() => {
                    return cb(new CancelTransactionError());
                }).catch( (err) => {
                    return cb(err);
                });
            }
            catch (err) {
                return cb(err);
            }

        }, (err) => {
            // if error is an instance of CancelTransactionError
            if (err && err instanceof CancelTransactionError) {
                return resolve();
            }
            if (err) {
                return reject(err);
            }
            // exit
            return resolve();
        });
    });
}

function cancelTransaction() {
    throw new CancelTransactionError();
}

/**
 * 
 * @param {import("@themost/express").ExpressDataApplication} app 
 * @returns 
 */
async function finalizeApplication(app) {
    if (app == null) {
        return;
    }
    const service = app.getConfiguration().getStrategy(DataCacheStrategy);
    if (typeof service.finalize === 'function') {
        await service.finalize();
    }
}

function getTestApplication() {
    const container = getApplication();
    /**
     * @type {import('@themost/express').ExpressDataApplication}
     */
    const app = container.get(ExpressDataApplication.name);
    /**
     * @type {Array<any>}
     */
    const adapters = app.getConfiguration().getSourceAt('adapters');
    adapters.unshift(
        {
            "name": "test",
            "invariantName": "sqlite",
            "default": true,
            "options": {
                "database": ":memory:"
            }
        }
    );
    // reload configurarion
    app.getConfiguration().useStrategy(DataConfigurationStrategy, DataConfigurationStrategy);
    return container;
}

/**
 * @param {import('@themost/express').ExpressDataApplication} app 
 */
function cleanupApplication(app) {
    // clear application cache
    const configuration = app.getConfiguration();
    delete configuration.cache;
    delete SqliteAdapter.supportMigrations;
}

export {
    executeInTransaction,
    cancelTransaction,
    finalizeApplication,
    getTestApplication,
    cleanupApplication
}