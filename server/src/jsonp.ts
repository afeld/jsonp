'use strict';

import JSON3 from 'json3';
import * as contentHelper from './content-helper';

interface JSONPCallbackQuery {
  callback?: string;
  jsonp?: string;
}

const getCallbackName = (params: JSONPCallbackQuery) => {
  return params.callback || params.jsonp;
};

export const isJsonP = (params: JSONPCallbackQuery) => {
  // TODO check media type?
  return !!getCallbackName(params);
};

const escapeClosingTags = (str: string) => {
  // http://stackoverflow.com/a/9249932/358804
  return str.replace(/<\//g, '<\\/');
};

const wrapInCallback = (callbackName: string, body: string) => {
  return `${callbackName}(${body});`;
};

export const transformJsonPBody = (
  params: JSONPCallbackQuery,
  body: string
) => {
  // TODO only check if valid JSON once (see router)
  if (!contentHelper.isValidJson(body)) {
    // escape and pass via JSON
    body = JSON3.stringify({
      data: body
    });
  }

  body = escapeClosingTags(body);

  // TODO figure out how to get rid of the fallback, as only needed for TypeScript
  const callbackName = getCallbackName(params) || '';
  body = wrapInCallback(callbackName, body);

  return body;
};
