module.exports = function (api) {
    api.cache(false);
    return {
        'sourceMaps': 'inline',
        'presets': [
            [
                '@babel/preset-env',
                {
                    'targets': {
                        'node': 'current'
                    }
                }
            ]
        ],
        'plugins': [
            [
                '@babel/plugin-proposal-class-properties'
            ],
            [
                '@babel/plugin-proposal-decorators', {
                    decoratorsBeforeExport: false
                }
            ]
        ]
    };
};
