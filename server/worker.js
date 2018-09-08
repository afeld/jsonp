const proxy = require("./proxy-request");
const proxyUtil = require("./proxy_util");
const url = require("url");

addEventListener("fetch", event => {
  event.respondWith(fetchAndApply(event.request));
});

async function fetchAndApply(req) {
  const query = url.parse(req.url, true).query;
  let apiUrl = proxyUtil.getApiUrlFromQuery(query);
  const response = await proxy(apiUrl, req);
  return response;
}
