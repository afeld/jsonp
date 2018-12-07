const cors = require('./app-helper').cors;
const fs = require('fs');
const path = require('path');
const proxy = require('./proxy-request');
const jsonp = require('./jsonp');
const contentHelper = require('./content-helper');
const proxyUtil = require('./proxy_util');
const url = require('url');

// can only use loaders when building with webpack, so fall back to normal file reading for tests
if (!process.env.WEBPACK) {
  // eslint-disable-next-line no-global-assign
  require = srcPath => {
    const srcAbsPath = path.resolve(__dirname, srcPath);
    return fs.readFileSync(srcAbsPath, 'utf8');
  };
}

const files = {
  '/': require('../public/index.html'),
  '/app.css': require('../public/app.css')
};

const emptyFn = () => {};

function getApiUrl(req) {
  const query = url.parse(req.url, true).query;
  return proxyUtil.getApiUrlFromQuery(query);
}

const proxyReq = async req => {
  const apiUrl = getApiUrl(req);
  const proxyRes = await proxy(apiUrl, req);

  const reqUrl = new URL(req.url);
  const query = contentHelper.iteratorToObj(reqUrl.searchParams);
  const resHeaders = new Headers(proxyRes.headers);
  let body = await proxyRes.text();
  if (jsonp.isJsonP(query)) {
    body = jsonp.transformJsonPBody(query, body);
    resHeaders.set('content-type', 'text/javascript'); // use instead of 'application/javascript' for IE < 8 compatibility
  }

  // fetch() response isn't mutable, so make a new one
  const res = new Response(body, {
    status: proxyRes.status,
    statusText: proxyRes.statusText,
    headers: resHeaders
  });

  // make browser Response act like http.ServerResponse
  res.setHeader = res.headers.set.bind(res.headers);
  cors(req, res, emptyFn);

  return res;
};

const render = req => {
  let status = 200;
  let contentType = 'text/html';

  const parsedUrl = new URL(req.url);
  const path = parsedUrl.pathname;
  if (path.endsWith('.css')) {
    contentType = 'text/css';
  }

  const lastSegment = path.substring(path.lastIndexOf('/'));
  let contents = files[lastSegment];

  if (!contents) {
    status = 404;
    contents = `${lastSegment} not found`;
  }

  return new Response(contents, {
    status,
    headers: { 'content-type': contentType }
  });
};

module.exports = req => {
  const apiUrl = getApiUrl(req);
  if (apiUrl) {
    return proxyReq(req);
  }
  return render(req);
};
