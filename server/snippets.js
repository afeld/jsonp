'use strict';

const fs = require('fs'),
  path = require('path');

let dir = 'views/snippets/',
  files = fs.readdirSync(dir);

let obj = {};
files.forEach(function(file) {
  let base = path.basename(file, '.html');
  base = path.basename(base, '.js');
  obj[base] = fs.readFileSync(dir + file);
});

module.exports = obj;
