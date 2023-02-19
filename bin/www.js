/* eslint-env node */
const { serveApplication, getApplication } = require('../dist/index');
const debug = require('debug');
const error = debug('app:error');
(async function() {
    try {
        await serveApplication(getApplication(), process.env.PORT, process.env.IP);
    }
    catch(err) {
        error(err);
        process.exit(1);
    }
})();