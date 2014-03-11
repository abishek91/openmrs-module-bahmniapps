'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist',
        test: 'test'
    };

    try {
        yeomanConfig.app = require('./package.json').appPath || yeomanConfig.app;
    } catch (e) {
    }

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            compass: {
                files: ['<%= yeoman.app %>/assets/styles/**/*.{scss,sass}'],
                tasks: ['compass']
            },
            livereload: {
                files: [
                    '<%= yeoman.app %>/**/*.html',
                    '<%= yeoman.app %>/**/*.js',
                    '<%= yeoman.app %>/assets/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= yeoman.app %>/assets/styles/*.css',
                    '!<%= yeoman.app %>/components',
                    '!<%= yeoman.app %>/lib'
                ],
                tasks: ['livereload']
            }
            // Tried to link watch to karma, so that watch can run all
            // the background tasks which need to run on file change, including
            // karma. Doesn't seem to be working.
            //
            // https://github.com/karma-runner/grunt-karma#karma-server-with-grunt-watchregarde
            // https://github.com/karma-runner/grunt-karma/issues/30
            // https://github.com/karma-runner/grunt-karma/issues/33
            // https://github.com/karma-runner/grunt-karma/issues/22
            // https://github.com/karma-runner/grunt-karma/issues/36
            //test: {
            //files: [
            //'<%= yeoman.app %>/**/*.js',
            //'<%= yeoman.test %>/unit/**/*.js',
            //'<%= yeoman.test %>/support/**/*.js'
            //],
            //tasks: ['karma:unitd:run']
            //}
        },
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, 'test')
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                url: 'http://localhost:<%= connect.options.port %>'
            }
        },
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '<%= yeoman.app %>/assets/styles/*.css',
                            '<%= yeoman.dist %>/*',
                            '!<%= yeoman.dist %>/.git*'
                        ]
                    }
                ]
            },
            server: [
                '<%= yeoman.app %>/assets/styles/.css/**'
            ]
        },
        karma: {
            unit: {
                configFile: 'test/config/testacular.conf.js'
            },
            e2e: {
                configFile: 'test/config/testacular-e2e.conf.js'
            },
            auto: {
                configFile: 'test/config/testacular.conf.js',
                autoWatch: true,
                singleRun: false
            }
        },
        compass: {
            options: {
                sassDir: '<%= yeoman.app %>/assets/styles',
                cssDir: '<%= yeoman.app %>/assets/styles',
                imagesDir: '<%= yeoman.app %>/assets/images',
                javascriptsDir: '<%= yeoman.app %>/scripts',
                fontsDir: '<%= yeoman.app %>/assets/styles/fonts',
                importPath: '<%= yeoman.app %>/components',
                relativeAssets: false
            },
            dist: {},
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        useminPrepare: {
            html: [
                '<%= yeoman.app %>/patients/*.html',
                '<%= yeoman.app %>/clinical/*.html',
                '<%= yeoman.app %>/**/*.html',
                '<%= yeoman.app %>/adt/**/*.html',
                '<%= yeoman.app %>/bed-management/**/*.html',
                '<%= yeoman.app %>/common/**/*.html',
                '<%= yeoman.app %>/trends/**/*.html',
                '<%= yeoman.app %>/orders/**/*.html',
                '<%= yeoman.app %>/document/**/*.html',
                '<%= yeoman.app %>/document-upload/**/*.html'
            ],
            css: '<%= yeoman.app %>/assets/styles/.css/**/*.css',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },
        usemin: {
            html: [
                '<%= yeoman.dist %>/patients/**/*.html',
                '<%= yeoman.dist %>/clinical/**/*.html',
                '<%= yeoman.dist %>/adt/**/*.html',
                '<%= yeoman.dist %>/bed-management/**/*.html',
                '<%= yeoman.dist %>/common/**/*.html',
                '<%= yeoman.dist %>/trends/**/*.html',
                '<%= yeoman.dist %>/trends/**/*.html',
                '<%= yeoman.dist %>/orders/**/*.html',
                '<%= yeoman.dist %>/document/**/*.html',
                '<%= yeoman.dist %>/document-upload/**/*.html',
            ],
            css: '<%= yeoman.dist %>/assets/styles/**/*.css',
            options: {
                dirs: ['<%= yeoman.dist %>']
            }
        },
        imagemin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/assets/images',
                        src: '**/*.{png,jpg,jpeg,gif}',
                        dest: '<%= yeoman.dist %>/assets/images'
                    }
                ]
            }
        },
        cssmin: {
            options: {
                banner: '/* Bahmni OPD minified CSS file */'
            },
            minify: {
                expand: true,
                cwd: '<%= yeoman.dist %>/assets/styles/css/',
                src: ['**/*.css', '!**/*.min.css'],
                dest: '<%= yeoman.dist %>/assets/styles/css/',
                ext: '.min.css'
            }
        },
        htmlmin: {
            dist: {
                options: {
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>',
                        src: [
                            'patients/**/*.html',
                            'clinical/**/*.html',
                            'adt/**/*.html',
                            'bed-management/**/*.html',
                            'common/**/*.html',
                            'trends/**/*.html',
                            'orders/**/*.html',
                            'document/**/*.html',
                            'document-upload/**/*.html'
                        ],
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }
        },
        ngmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>/patients',
                        src: '**/*.js',
                        dest: '<%= yeoman.dist %>/patients'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>/clinical',
                        src: '**/*.js',
                        dest: '<%= yeoman.dist %>/clinical'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>/adt',
                        src: '**/*.js',
                        dest: '<%= yeoman.dist %>/adt'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>/bed-management',
                        src: '**/*.js',
                        dest: '<%= yeoman.dist %>/bed-management'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>/trends',
                        src: '**/*.js',
                        dest: '<%= yeoman.dist %>/trends'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>/orders',
                        src: '**/*.js',
                        dest: '<%= yeoman.dist %>/orders'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>/document',
                        src: '**/*.js',
                        dest: '<%= yeoman.dist %>/document'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>/document-upload',
                        src: '**/*.js',
                        dest: '<%= yeoman.dist %>/document-upload'
                    }
                ]
            }
        },
        uglify: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/scripts/scripts.js': [
                        '<%= yeoman.dist %>/scripts/scripts.js'
                    ]
                }
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            '*.{ico,txt}',
                            '.htaccess',
                            'components/**/*',
                            'assets/images/**/*.{gif,webp}',
                            'assets/styles/fonts/*',
                            'assets/lib/**/*'
                        ]
                    }
                ]
            }
        },
        rename: {
            minified: {
                files: [
                    {expand: true, cwd: '<%= yeoman.dist %>', src: ['patients.min.js'], dest: '<%= yeoman.dist %>/patients/'},
                    {expand: true, cwd: '<%= yeoman.dist %>', src: ['clinical.min.js'], dest: '<%= yeoman.dist %>/clinical/'},
                    {expand: true, cwd: '<%= yeoman.dist %>', src: ['adt.min.js'], dest: '<%= yeoman.dist %>/adt/'},
                    {expand: true, cwd: '<%= yeoman.dist %>', src: ['bed-management.min.js'], dest: '<%= yeoman.dist %>/bed-management/'},
                    {expand: true, cwd: '<%= yeoman.dist %>', src: ['orders.min.js'], dest: '<%= yeoman.dist %>/orders/'},
                    {expand: true, cwd: '<%= yeoman.dist %>', src: ['trends.min.js'], dest: '<%= yeoman.dist %>/trends/'},
                    {expand: true, cwd: '<%= yeoman.dist %>', src: ['document.min.js'], dest: '<%= yeoman.dist %>/document/'},
                    {expand: true, cwd: '<%= yeoman.dist %>', src: ['document-upload.min.js'], dest: '<%= yeoman.dist %>/document-upload/'},
                    {expand: true, cwd: '<%= yeoman.dist %>', src: ['patients.min.css'], dest: '<%= yeoman.dist %>/patients/'},
                    {expand: true, cwd: '<%= yeoman.dist %>', src: ['clinical.min.css'], dest: '<%= yeoman.dist %>/clinical/'},
                    {expand: true, cwd: '<%= yeoman.dist %>', src: ['adt.min.css'], dest: '<%= yeoman.dist %>/adt/'},
                    {expand: true, cwd: '<%= yeoman.dist %>', src: ['bed-management.min.css'], dest: '<%= yeoman.dist %>/bed-management/'},
                    {expand: true, cwd: '<%= yeoman.dist %>', src: ['trends.min.css'], dest: '<%= yeoman.dist %>/trends/'},
                    {expand: true, cwd: '<%= yeoman.dist %>', src: ['orders.min.css'], dest: '<%= yeoman.dist %>/orders/'},
                    {expand: true, cwd: '<%= yeoman.dist %>', src: ['document.min.css'], dest: '<%= yeoman.dist %>/document/'},
                    {expand: true, cwd: '<%= yeoman.dist %>', src: ['document-upload.min.css'], dest: '<%= yeoman.dist %>/document-upload/'}
                ]
            }
        }
    });

    grunt.renameTask('regarde', 'watch');

    grunt.registerTask('server', [
        'clean:server',
        'compass:server',
        'livereload-start',
        'connect:livereload',
        'open',
        'watch'
    ]);

    grunt.registerTask('test', [
        'clean:server',
        'compass',
        'connect:test',
        'karma:unit'
    ]);

    grunt.registerTask('dist', [
        'clean:dist',
        'compass:dist',
        'useminPrepare',
        'concat',
        'imagemin',
        'htmlmin',
        'cssmin',
        'copy:dist',
        'ngmin',
        //  ented since it is breaking angular. Possibly because of $rootScope
        //'uglify',
        'usemin',
        'rename:minified'
    ]);

    grunt.registerTask('build', [
        'test',
        'dist'
    ]);

    grunt.registerTask('default', ['build']);
};
