'use strict';

const getApiUrlFromQuery = query => {
  return query.url || query.src;
};

module.exports = { getApiUrlFromQuery };
