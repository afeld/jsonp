const cors = require('./app-helper').cors;
const proxy = require('./proxy-request');
const proxyUtil = require('./proxy_util');
const url = require('url');

const emptyFn = () => {};

function getApiUrl(req) {
  const query = url.parse(req.url, true).query;
  return proxyUtil.getApiUrlFromQuery(query);
}

module.exports = async function(req) {
  let apiUrl = getApiUrl(req);
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
