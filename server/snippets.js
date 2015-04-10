/*jshint node:true */
var fs = require('fs'),
  path = require('path');

var dir = 'views/snippets/',
  files = fs.readdirSync(dir);

var obj = {};
files.forEach(function(file){
  var base = path.basename(file, '.html');
  base = path.basename(base, '.js');
  obj[base] = fs.readFileSync(dir + file);
});

module.exports = obj;
