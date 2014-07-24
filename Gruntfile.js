/*global module*/
module.exports = function (grunt) {
    'use strict';

    var gruntConfig = {
        pkg: grunt.file.readJSON('package.json')
    };

    // convenience
    grunt.registerTask('default', ['cover']);


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
            'src/lib/**/*.js': ['coverage']
        },
        reporters: ['progress', 'coverage'],
        browsers: ['PhantomJS'],
        autoWatch: false,
        singleRun: true
    };
    grunt.registerTask('cover', ['karma:cover']);


    // release
    grunt.loadNpmTasks('grunt-bump');
    gruntConfig.bump = {
        options: {
            files: ['package.json', 'bower.json'],
            updateConfigs: ['pkg']
        }
    };
    grunt.loadNpmTasks('grunt-contrib-copy');
    gruntConfig.copy = {
        release: { files: [
            { cwd: '.', src: ['bower.json', 'LICENSE'], dest: 'output/release', expand: true },
            { cwd: 'src', src: ['lib/**/*'], dest: 'output/release', expand: true }
        ] }
    };
    grunt.loadNpmTasks('grunt-shell');
    gruntConfig.shell = {
        cloneRelease: {
            command: '(rm -rf output/release && git clone https://github.com/larsthorup/jsdevenv-bower-release.git output/release)'
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