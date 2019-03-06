'use strict';

interface JSONProxyQuery {
  url?: string;
  src?: string;
}

export const getApiUrlFromQuery = (query: JSONProxyQuery) => {
  return query.url || query.src;
};
