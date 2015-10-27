module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		//Grunt server settings
		connect: {
			example: {
				port: 8888,
				hostname: 'localhost'
			}
		}
	});

	grunt.loadNpmTasks('grunt-connect');
	grunt.registerTask('default', 'connect:example');

};