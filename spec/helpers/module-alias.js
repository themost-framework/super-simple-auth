require('module-alias/register');
const {addAliases} = require('module-alias');
const path = require('path');
const fs = require('fs');
if (fs.existsSync(path.resolve(process.cwd(), '.module-aliases.json'))) {
    // load configuration
    const aliases = require(path.resolve(process.cwd(), '.module-aliases.json'));
    addAliases(Object.keys(aliases).reduce((obj, key) => {
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            value: path.resolve(process.cwd(), aliases[key])
        });
        return obj;
    }, {}));
}
