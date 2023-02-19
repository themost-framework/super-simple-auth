const sass = require('sass');
const { resolve } = require('path');
const { writeFileSync } = require('fs');
const { TraceUtils } = require('@themost/common');
/**
 * @param {string} path
 * @param {import('sass').Options} options 
 */
function sassMiddleware(path, options) {
    try {
        const finalOptions = Object.assign( {
            sourceMap: true
        }, options);
        const data = sass.compile(path, finalOptions);
        writeFileSync(path.replace(/\.scss$/ig, '.css'), data.css);
        if (data.sourceMap) {
            writeFileSync(path.replace(/\.scss$/ig, '.css.map'), JSON.stringify(data.sourceMap, null, 4));
        }

    } catch (error) {
        TraceUtils.warn(error);
    }
};

sassMiddleware(resolve(process.cwd(), 'assets', 'stylesheets', 'style.scss' ))