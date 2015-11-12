/*jshint node:true */
'use strict';

const app = require('./app.js');

let apiPort = process.argv[2] || process.env.PORT || 8000;
app.listen(apiPort, function(){
  console.log(`Server running at http://127.0.0.1:${apiPort}`);
});
