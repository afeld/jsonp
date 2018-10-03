const cors = require('./app-helper').cors;
const path = require('path');
const proxy = require('./proxy-request');
const proxyUtil = require('./proxy_util');
const url = require('url');

const compileTemplate = templatePath => {
  const fs = require('fs');
  const ejs = require('ejs');
  const templateAbsPath = path.resolve(__dirname, templatePath);
  const templateSource = fs.readFileSync(templateAbsPath, 'utf8');
  return ejs.compile(templateSource);
};

// can only use loaders when building with webpack, so fall back to normal EJS for tests
const template = process.env.WEBPACK
  ? require(`ejs-compiled-loader!../views/index.ejs`)
  : compileTemplate('../views/index.ejs');

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

const renderHomepage = req => {
  const body = template({
    host: req.headers.get('host'),
    snippets: {}
  });
  return new Response(body, {
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
  return renderHomepage(req);
};
