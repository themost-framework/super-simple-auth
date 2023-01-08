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

export {
    executeInTransaction,
    cancelTransaction,
    finalizeApplication
}