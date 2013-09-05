module.exports = (grunt) ->
  
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    uglify:
      options:
        banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n'
      build:
        src: 'lib/device.js'
        dest: 'lib/device.min.js'
    coffee:
      compile:
        options:
          banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n'
          join: yes
        files:
          'lib/device.js': [
            'src/device.coffee'
          ]
    bumpup: 'package.json'
    watch:
      coffeescripts:
        files: [
          'src/device.coffee'
        ]
        tasks: ['build']
        options:
          livereload: true
  
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-bumpup'

  grunt.registerTask 'build', ['coffee', 'uglify']

  grunt.registerTask 'release', (type) ->
    type = if type then type else 'patch'
    grunt.task.run "bumpup:#{type}"
