const proxy = require('./proxy-request');
const proxyUtil = require('./proxy_util');
const url = require('url');

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

function getApiUrl(req) {
  const query = url.parse(req.url, true).query;
  return proxyUtil.getApiUrlFromQuery(query);
}

async function handleRequest(req) {
  let apiUrl = getApiUrl(req);
  return proxy(apiUrl, req);
}
