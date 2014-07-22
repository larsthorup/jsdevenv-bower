/*global module*/
module.exports = function (grunt) {
    'use strict';

    var gruntConfig = {
        pkg: grunt.file.readJSON('package.json')
    };

    // convenience
    grunt.registerTask('default', ['cover', 'bundle']);


    // test
    grunt.loadNpmTasks('grunt-karma');
    gruntConfig.karma = {
        options: {
            basePath: '.',
            frameworks: ['mocha', 'requirejs'],
            files: [
                'src/test/karma-test-main.js',
                'src/test/bind.js', // Note: polyfill for the benefit of less on Phantom
                {pattern: 'src/**/*.*', included: false},
                {pattern: 'bower_components/**/*.js', included: false}
            ],
            coverageReporter: {
                reporters: [
                    {type: 'lcov'},
                    {type: 'html'},
                    {type: 'cobertura'},
                    {type: 'text-summary'}
                ],
                dir: 'output/coverage'
            },
            port: 9876, // Note: web server port
            colors: true, // Note: enable / disable colors in the output (reporters and logs)
            logLevel: grunt.option('verbose') ? 'DEBUG' : 'INFO'
        }
    };
    gruntConfig.karma.test = {
        reporters: ['progress'],
        browsers: ['PhantomJS'],
        autoWatch: false,
        singleRun: true
    };
    grunt.registerTask('test', ['karma:test']);


    // cover
    gruntConfig.karma.cover = {
        preprocessors: {
            // Note: instrument all code files, but not test files
            'src/app/**/!(*test).js': ['coverage']
        },
        reporters: ['progress', 'coverage'],
        browsers: ['PhantomJS'],
        autoWatch: false,
        singleRun: true
    };
    grunt.registerTask('cover', ['karma:cover']);


    // bundle
    grunt.loadNpmTasks('grunt-contrib-copy');
    gruntConfig.copy = {
    };
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    gruntConfig.requirejs = {

        // Note: shared configuration for all bundled modules
        options: {
            baseUrl: 'src',
            mainConfigFile: 'src/require.conf.js',
            optimize: 'none',

            // Note: "css" module not used in production as all css is bundled
            exclude: ['jquery', 'require-less/normalize', 'require-less/less', 'text']
        },

        // Note: bundle the "main" module and every module referenced recursively by it
        module: {
            options: {
                name: 'lib/newsfeed',
                out: 'output/dist/newsfeed.js',

                // Note: "text" and "less" modules not used in production as all text and css is bundled
                stubModules: [
                    'text',
                    'require-less/less'
                ]
            }
        }
    };
    grunt.registerTask('bundle', ['requirejs']);


    // release
    grunt.loadNpmTasks('grunt-bump');
    gruntConfig.bump = {
        options: {
            files: ['package.json', 'bower.json'],
            updateConfigs: ['pkg']
        }
    };
    grunt.loadNpmTasks('grunt-shell');
    gruntConfig.shell = {
        cloneRelease: {
            command: '(rm -rf output/release && git clone https://github.com/larsthorup/jsdevenv-require-bower.git output/release)'
        },
        commitRelease: {
            // ToDo: how to remove files no longer there?
            command: '(cd output/release && git add * && git commit -m "Release <%=pkg.version%>")'
        },
        tagRelease: {
            command: '(cd output/release && git tag v<%=pkg.version%> -a -m "Release <%=pkg.version%>")'
        },
        pushRelease: {
            command: '(cd output/release && git push origin master --tags)'
        }
    };
    grunt.registerTask('release', [
        'bump-only',
        'shell:cloneRelease',
        'test',
        'bundle',
        'copy:release',
        'shell:commitRelease',
        'shell:tagRelease',
        'shell:pushRelease',
        // 'bump-commit',
        // 'bowerRegister'
    ]);

    // grunt
    grunt.initConfig(gruntConfig);
};