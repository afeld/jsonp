'use strict';

const url = require('url');
const keen = require('./client');
const proxyUtil = require('../proxy_util');


const getCommonEvent = (req) => {
  const apiUrl = proxyUtil.getApiUrl(req);
  let apiHost;
  if (apiUrl) {
    apiHost = url.parse(apiUrl).host;
  }

  return {
    method: req.method,
    path: req.path,
    ip: req.ips[0],
    apiHost: apiHost
  };
};

const registerResponse = (req, res, resEvent, start) => {
  const end = new Date().getTime();
  const resTime = end - start; // milliseconds

  const eventData = getCommonEvent(req);
  eventData.event = resEvent;
  eventData.statusCode = res.statusCode;
  eventData.resTime = resTime;

  keen.recordEvent('reqEnd', eventData);
};

module.exports = (req, res, next) => {
  const start = new Date().getTime();

  const event = getCommonEvent(req);
  keen.recordEvent('reqStart', event);

  res.on('close', () => {
    registerResponse(req, res, 'close', start);
  });
  res.on('finish', () => {
    registerResponse(req, res, 'finish', start);
  });

  next();
};
