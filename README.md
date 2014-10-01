# Accessibility Tester

Grunt script which downloads pages as HTML and runs grunt-accessibility tast to generate accessibility reports
 
##Requirements
 
 * Grungjs (http://gruntjs.com/)
 * Phantomjs (https://www.npmjs.org/package/phantomjs) (http://phantomjs.org/)
 
##Grungjs script
 * Update gruntfile.js with your custom URL and pages under that URL
 * Run grunt with default task: 
> sudo grunt

##PhantomJS script
* scripts/pagedownload.js can be executed manually by running 
> phantomjs pagedownload.js [some URL] [destination]
 
##Issues
 * grunt-accessibility has issue generating reports for multiple HTML files, for now use one file at a time 
