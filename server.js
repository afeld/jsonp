/*jshint node:true */
var app = require('./lib/app.js');

var apiPort = process.argv[2] || 8000;
app.listen(apiPort);
console.log('Server running at http://127.0.0.1:' + apiPort);
