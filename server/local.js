const express = require('express');
const morgan = require('morgan');
require('../test/server/support');
const contentHelper = require('./content-helper');

const fetchListeners = [];

const app = express();
app.use(morgan('combined'));
const port = 3000;

const reqObjFromExpressReq = req => {
  // https://stackoverflow.com/a/10185427/358804
  var url = req.protocol + '://' + req.get('host') + req.originalUrl;
  return new Request(url);
};

app.get('*', (req, res) => {
  fetchListeners.forEach(listener => {
    const reqObj = reqObjFromExpressReq(req);

    // mimic FetchEvent
    // https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent
    const event = {
      request: reqObj,
      respondWith: async resPromise => {
        const resObj = await resPromise;
        // send from Fetch API Response object to ExpressJS response
        res.status(resObj.status);
        const headerObj = contentHelper.iteratorToObj(resObj.headers);
        res.set(headerObj);
        const body = await resObj.buffer();
        res.send(body);
      }
    };

    listener(event);
  });
});

app.listen(
  port,
  () => console.log(`Example app running at http://localhost:${port}`) // eslint-disable-line no-console
);

// simulate a browser
global.addEventListener = (eventName, callback) => {
  if (eventName === 'fetch') {
    fetchListeners.push(callback);
  }
};

require('./worker');
