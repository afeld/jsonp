const cors = require('cors');
const proxy = require('./proxy-request');
const proxyUtil = require('./proxy_util');
const url = require('url');

const corsMiddleware = cors({
  maxAge: 60 * 60 * 24, // one day
  methods: ['GET']
});

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

function getApiUrl(req) {
  const query = url.parse(req.url, true).query;
  return proxyUtil.getApiUrlFromQuery(query);
}

async function handleRequest(req) {
  let apiUrl = getApiUrl(req);
  const proxyRes = await proxy(apiUrl, req);

  // fetch() response isn't mutable, so make a new one
  const res = new Response(proxyRes.body, {
    status: proxyRes.status,
    headers: proxyRes.headers
  });

  // make browser Response act like http.ServerResponse
  res.setHeader = res.headers.set.bind(res.headers);
  corsMiddleware(req, res, () => {});

  return res;
}
