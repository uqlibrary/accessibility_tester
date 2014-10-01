/**
 * Created by uqjmalik on 26/09/2014
 * phantom js script to download html page from url
 *
 * usage:
 *  phantomjs pagedownload.js <some URL> <destination>
 *
 * to download from HTTPS use:
 *  phantomjs --ignore-ssl-errors=yes --ssl-protocol=any pagedownload.js https://<some URL> <destination>
 */
var page = require('webpage').create(),
  fs = require('fs'),
  system = require('system'),
  address, destination;

if (system.args.length !== 3) {
  console.log('Usage: pagedownload.js <some URL> <destination>');
  phantom.exit(1);
} else {
  address = system.args[1];
  destination = system.args[2];

  page.open(address, function (status) {
    if (status !== 'success') {
      console.error('FAILED to load the address: ' + address);
    } else {
      fs.write(destination, page.content, 'w');
      console.log('File created: ' + destination);
    }

    phantom.exit();
  });
}
