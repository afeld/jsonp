'use strict';

interface JSONProxyQuery {
  url?: string;
  src?: string;
}

const getApiUrlFromQuery = (query: JSONProxyQuery) => {
  return query.url || query.src;
};

module.exports = { getApiUrlFromQuery };
