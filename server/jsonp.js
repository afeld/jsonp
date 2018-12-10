'use strict';

// JSONP middleware

const JSON3 = require('json3');
const contentHelper = require('./content-helper');

let getCallbackName = function(params) {
  return params.callback || params.jsonp;
};

let isJsonP = function(params) {
  // TODO check media type?
  return !!getCallbackName(params);
};

let escapeClosingTags = function(str) {
  // http://stackoverflow.com/a/9249932/358804
  return str.replace(/<\//g, '<\\/');
};

let wrapInCallback = function(callbackName, body) {
  return `${callbackName}(${body});`;
};

let transformJsonPBody = function(params, body) {
  // TODO only check if valid JSON once (see router)
  if (!contentHelper.isValidJson(body)) {
    // escape and pass via JSON
    body = JSON3.stringify({ data: body });
  }

  body = escapeClosingTags(body);

  let callbackName = getCallbackName(params);
  body = wrapInCallback(callbackName, body);

  return body;
};

module.exports = {
  isJsonP,
  transformJsonPBody
};
