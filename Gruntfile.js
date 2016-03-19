module.exports = function(grunt) {

  var bowerDependencyStylePaths = grunt.file.expand("gui-switch-control/bower_components/{core-*,gc-*,gui-*}/src/style");
  var allImportPaths = [
    "gui-switch-control/src/style/",
  ].concat(bowerDependencyStylePaths);

  require("grunt-task-loader")(grunt);
  grunt.initConfig({});

  // Debug
  grunt.task.registerTask("debug", function () {
    console.log(allImportPaths);
  })

  // Copy & Rename
  // simulated existing rename (except new .temp dir)
  grunt.config("copy", {
    style: {
      files: [{
        expand: true,
        cwd: "gui-switch-control/src/style/",
        dest: "gui-switch-control/src/style/.temp/",
        src: ["_*.scss"],
        rename: function (dest, src) {
          return dest + src.replace(/^[_]/, "");
        }
      }]
    }
  });

  // Sass
  // simulated existing sass build (except using libsass)
  grunt.config("sass", {
    options: {
      precision: 6,
      sourceMap: false,
      includePaths: allImportPaths
    },
    build: {
      files: [{
        expand: true,
        cwd: "gui-switch-control/src/style/.temp/",
        src: ["*.scss"],
        dest: "gui-switch-control/src/style/.temp/",
        ext: ".css"
      }]
    }
  });

  // PostCSS
  // new: use postcss for autoprefixer & minification
  grunt.config("postcss", {
    options: {
      processors: [
        require("autoprefixer")(),
        require("csswring")
      ]
    },
    build: {
      files: [{
        expand: true,
        cwd: "gui-switch-control/src/style/.temp/",
        src: ["*.css"],
        dest: "gui-switch-control/src/style/.temp/"
      }]
    }
  });

  // CSS2JS
  // new: use css2js to convert css to js string
  grunt.config("css2js", {
    build: {
      files: [{
        expand: true,
        cwd: "gui-switch-control/src/style/.temp/",
        src: ["*.css"],
        dest: "gui-switch-control/src/style/.temp/",
        ext: ".js"
      }]
    }
  });

  // new: use concat to wrap as $templateCache & module
  // problem!!!
  // all related tools make wrong choices for us--or have a bug
  // grunt-es-css2js throws an error with above just-fine file config
  // grunt-css2js hard-codes a specific template around the string
  // not the one we want. so...
  // css2js has multiple template options, but...
  // not the one we want, and...
  // you can't pass one in: have to add to template folder, plus...
  // grunt-css2js doesn't expose the option, anyway
  // actually, it doesn't even use css2js
  // there is no "just the string" option for either currently >_<
  // currently... forked grunt-css2-js and...
  // hardcoded the angular template we want, but...
  // would prefer a different approach
  // maybe submitting template/pass-in to css2js?
  // or submitting template functionality PR to grunt-css2js?

  grunt.registerTask('default', ["copy:style", "sass:build", "postcss:build", "css2js:build"]);

};
