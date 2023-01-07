module.exports = function (api) {
    api.cache(false);
    api.debug = true;
    return {
        'sourceMaps': 'both',
        'retainLines': true,
        'presets': [
            [
                '@babel/preset-env',
                {
                    'targets': {
                        'node': 'current'
                    }
                }
            ],
            [
                '@babel/preset-typescript'
            ]
        ],
        'exclude': [
            /node_modules/
          ],  
        'plugins': [
            [
                '@babel/plugin-proposal-decorators', {
                    version: 'legacy'
                }
            ],
            [
                '@babel/plugin-proposal-class-properties'
            ]
        ]
    };
};
