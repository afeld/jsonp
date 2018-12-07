'use strict';

const getApiUrlFromQuery = query => {
  return query.url || query.src;
};

const getApiUrl = req => {
  return getApiUrlFromQuery(req.query);
};

module.exports = { getApiUrlFromQuery, getApiUrl };
