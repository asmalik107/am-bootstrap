module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		site: grunt.file.readYAML('_config.yml'),
		banner: '/*!\n' + ' * Boostrap v<%= pkg.version %> (<%= pkg.homepage %>)\n' + ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' + ' * Licensed under <%= _.pluck(pkg.licenses, "type") %> (<%= _.pluck(pkg.licenses, "url") %>)\n' + ' */\n',
		jqueryCheck: 'if (typeof jQuery === "undefined") { throw new Error("Bootstrap requires jQuery") }\n\n',

		bootstrap: {
			scss: ['scss/app.scss'],
			path: 'bower_components/bootstrap-sass-official/',
			pathjs: 'bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/'

		},
		fontAwesome: {
			path: 'bower_components/font-awesome/'
		},

		clean: {
			dist: ['dist', '<%= site.destination %>/**/*', '!<%= site.destination %>/.{git,gitignore}']
		},

		copy: {
			fonts: {
				expand: true,
				cwd: '<%= bootstrap.path %>' + 'vendor/assets/fonts/bootstrap',
				src: ['*'],
				dest: 'dist/fonts/'
			},
			fontAwesome: {
				expand: true,
				cwd: '<%= fontAwesome.path %>',
				src: ['fonts/*'],
				dest: 'dist/'
			},
			assets: {
				expand: true,
				src: ['assets/**'],
				dest: 'dist'
			},
			docs: {
				expand: true,
				cwd: 'dist/',
				src: '**',
				dest: 'docs/dist'
			}
		},

		concat: {
			options: {
				banner: '<%= banner %>\n<%= jqueryCheck %>',
				stripBanners: false
			},
			bootstrap: {
				src: [
					'<%= bootstrap.pathjs %>transition.js',
					'<%= bootstrap.pathjs %>alert.js',
					'<%= bootstrap.pathjs %>button.js',
					'<%= bootstrap.pathjs %>carousel.js',
					'<%= bootstrap.pathjs %>collapse.js',
					'<%= bootstrap.pathjs %>dropdown.js',
					'<%= bootstrap.pathjs %>modal.js',
					'<%= bootstrap.pathjs %>/tooltip.js',
					'<%= bootstrap.pathjs %>/popover.js',
					'<%= bootstrap.pathjs %>/scrollspy.js',
					'<%= bootstrap.pathjs %>/tab.js',
					'<%= bootstrap.pathjs %>/affix.js'
				],
				dest: 'dist/js/<%= pkg.name %>.js'
			}
		},

		uglify: {
			bootstrap: {
				options: {
					banner: '<%= banner %>\n',
					report: 'min'
				},
				src: ['<%= concat.bootstrap.dest %>'],
				dest: 'dist/js/<%= pkg.name %>.min.js'
			}
		},


		sass: {
			options: {
				includePaths: ['bower_components/bootstrap-sass-official/vendor/assets/stylesheets/bootstrap',
					'bower_components/font-awesome/scss'
				]
			},
			dist: {
				options: {
					//outputStyle: 'compressed'
					sourceComments: 'map',
					sourceMap: '<%= pkg.name %>.css.map'
				},
				files: {
					'dist/css/<%= pkg.name %>.css': '<%= bootstrap.scss %>'
				}
			},
			/*			docs: {
				options: {
					includePaths: ['scss', 'bower_components/foundation/scss', 'bower_components/font-awesome/scss'],
					sourceComments: 'map',
					sourceMap: 'docs.css.map'
				},
				files: {
					'dist/docs/assets/css/docs.css': 'doc/assets/scss/docs.scss'
				}
			},*/
			minify: {
				options: {
					outputStyle: 'compressed'
				},
				files: {
					'dist/css/<%= pkg.name %>.min.css': '<%= bootstrap.scss %>'
				}
			}
		},

		usebanner: {
			dist: {
				options: {
					position: 'top',
					banner: '<%= banner %>'
				},
				files: {
					src: [
						'dist/css/<%= pkg.name %>.css',
						'dist/css/<%= pkg.name %>.min.css',
						'dist/css/<%= pkg.name %>-theme.css',
						'dist/css/<%= pkg.name %>-theme.min.css',
					]
				}
			}
		},

		csslint: {
			options: {
				csslintrc: 'scss/.csslintrc'
			},
			src: [
				'dist/css/bootstrap.css',
				'dist/css/bootstrap-theme.css'
			]
		},
		csscomb: {
			sort: {
				options: {
					config: 'scss/.csscomb.json'
				},
				files: {
					'dist/css/<%= pkg.name %>.css': ['dist/css/<%= pkg.name %>.css'],
					'dist/css/<%= pkg.name %>-theme.css': ['dist/css/<%= pkg.name %>-theme.css'],
				}
			}
		},

		jekyll: {
			docs: {}
		},

		watch: {
			grunt: {
				files: ['Gruntfile.js']
			},

			sass: {
				files: 'scss/**/*.scss',
				tasks: ['sass', 'dist-docs']
			}
		}

	});

	// These plugins provide necessary tasks.
	require('load-grunt-tasks')(grunt, {
		scope: 'devDependencies'
	});


	// JS distribution task.
	grunt.registerTask('dist-js', ['concat', 'uglify']);
	// CSS distribution task.
	grunt.registerTask('dist-css', ['sass', 'csscomb', 'usebanner', 'csslint']);
	// Docs distribution task.
	grunt.registerTask('dist-docs', ['copy:docs', 'jekyll']);
	// Full distribution task.
	grunt.registerTask('dist', ['clean', 'dist-css', 'copy:fonts', 'copy:assets', 'copy:fontAwesome', 'dist-js', 'dist-docs']);
	//Default Task
	grunt.registerTask('build-watch', ['dist', 'watch']);
	//Default Task
	grunt.registerTask('default', ['dist']);
}