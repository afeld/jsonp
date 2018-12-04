const cors = require('./app-helper').cors;
const path = require('path');
const proxy = require('./proxy-request');
const proxyUtil = require('./proxy_util');
const url = require('url');

const readFile = srcPath => {
  const fs = require('fs');
  const srcAbsPath = path.resolve(__dirname, srcPath);
  return fs.readFileSync(srcAbsPath, 'utf8');
};

// can only use loaders when building with webpack, so fall back to normal file reading for tests
const index = process.env.WEBPACK
  ? require('./index.html')
  : readFile('./index.html');

const emptyFn = () => {};

function getApiUrl(req) {
  const query = url.parse(req.url, true).query;
  return proxyUtil.getApiUrlFromQuery(query);
}

const proxyReq = async req => {
  const apiUrl = getApiUrl(req);
  const proxyRes = await proxy(apiUrl, req);

  // fetch() response isn't mutable, so make a new one
  const res = new Response(proxyRes.body, {
    status: proxyRes.status,
    statusText: proxyRes.statusText,
    headers: proxyRes.headers
  });

  // make browser Response act like http.ServerResponse
  res.setHeader = res.headers.set.bind(res.headers);
  cors(req, res, emptyFn);

  return res;
};

const renderHomepage = () => {
  return new Response(index, {
    headers: {
      'content-type': 'text/html'
    }
  });
};

module.exports = req => {
  const apiUrl = getApiUrl(req);
  if (apiUrl) {
    return proxyReq(req);
  }
  return renderHomepage();
};
