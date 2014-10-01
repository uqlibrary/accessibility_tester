/*
* Grunt script for downloading an HTML page from URL and running a grunt-accessibility task on it
*
* Warning: grunt-accessibility runs ONE page at a time (known bug)
*
* */

'use strict';
var createFileName = function(url){
  return url.replace(/\//g, '-') + '.html';
}

module.exports = function(grunt) {

  var wcagOptions = {
    url         : 'https://app.library.uq.edu.au/#/',           //parent URL
    pages       : [                                             //pages to check (works for one page only)
                    'membership/form/alumni',
                    //'membership/form/alumni',
                    //'membership/form/hospital',
                    //'membership/form/retired',
                    //'membership/form/reciprocal'
                  ],
    src         : 'src/',                                       //location for HTML pages
    files       : [],                                           //files on which accessibility tests are run (populated from pages)
    reports     : 'reports/',                                   //location for WCAG report files
    reportsExt  : '-' + new Date().getTime() + '-report.txt'    //extension for report file
  };

  //populate file names based on pages
  wcagOptions.pages.forEach(function(page){
    wcagOptions.files.push(createFileName(page));
  })

  // load all grunt tasks
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-accessibility');

  grunt.initConfig({
    clean: [
      wcagOptions.src + '*'
    ],

    accessibility: {
      options : {
        accessibilityLevel: 'WCAG2AA',
        outputFormat: 'txt', //or 'json'
        verbose: true,
        domElement: true
      },
      test : {
        files: [{
          expand  : true,
          cwd     : wcagOptions.src,
          src     : wcagOptions.files,
          dest    : wcagOptions.reports,
          ext     : wcagOptions.reportsExt
        }]
      }
    }
  });

  grunt.registerTask('get_html', function () {
    var done = this.async();
    var pagesFetched = 0;

    var
      childProcess  = require('child_process'),
      phantomjs     = require('phantomjs'),
      binPath       = phantomjs.path;

    var options = {
      script: 'scripts/pagedownload.js',
      sourceUrl: wcagOptions.url,
      destinationDir: wcagOptions.src,
      pages : wcagOptions.pages
    };

    options.pages.forEach(function(page){

      grunt.log.debug("Fetching: " + page);

      childProcess.execFile(
        binPath,
        [
          '--ignore-ssl-errors=yes',
          '--ssl-protocol=any',
          options.script,
          options.sourceUrl + page,
          options.destinationDir + createFileName(page)
        ],
        {},
        function (error, stdout, stderr) {
        pagesFetched++;

        if (stdout.toString().indexOf('FAILED') > -1) {
          grunt.fail.warn('Failed to download: ' + page);
        }
        else {
          grunt.log.debug('Saved: ' + createFileName(page) + ' from ' + page);
        }

        if (pagesFetched == options.pages.length) {
          done.apply();
        }
      })
    });
  });


  grunt.registerTask('default', [
    'clean',
    'get_html',
    'accessibility'
  ]);

};



