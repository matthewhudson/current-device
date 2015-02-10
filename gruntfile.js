module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n'
      },
      build: {
        src: 'lib/device.js',
        dest: 'lib/device.min.js'
      }
    },
    bumpup: 'package.json'
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-bumpup');

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('release', ['bump', 'uglify']);
  grunt.registerTask('bump', function(type) {
    type = type ? type : 'patch';
    grunt.task.run("bumpup:" + type);
  });
};
