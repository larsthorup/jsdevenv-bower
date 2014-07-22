require.config({
    paths: {
        'jquery': '../bower_components/jquery/dist/jquery',
        'text': '../bower_components/requirejs-text/text',
        'require-css': '../bower_components/require-css',
        'require-less': '../bower_components/require-less'
    },
    map: {
        '*': {
            'css': 'require-css/css',
            'less': 'require-less/less'
        }
    },
    shims: {
        'jquery': {
            export: '$'
        }
    },
    less: {
        logLevel: 1 // Note: only show errors
    }
});
