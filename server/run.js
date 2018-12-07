'use strict';

const compress = require('compression'),
  app = require('./app.js');

// Serverless doesn't support compression out of the box, so only use it here
app.use(compress());

let apiPort = process.argv[2] || process.env.PORT || 8000;
app.listen(apiPort, function() {
  console.log(`Server running at http://127.0.0.1:${apiPort}`); // eslint-disable-line no-console
});
