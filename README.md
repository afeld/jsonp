# JSONProxy [![Build Status](https://travis-ci.org/afeld/jsonp.png?branch=master)](https://travis-ci.org/afeld/jsonp)

Simple HTTP proxy that enables cross-domain requests to any JSON API. See https://jsonp.afeld.me for documentation. See the [releases](https://github.com/afeld/jsonp/releases) page for the [client library](jsonp.js) changelog.

## Setup

See [`.travis.yml`](.travis.yml) for compatible Node versions.

```
npm install
npm start
```

and do requests to `http://localhost:8000/?url=...`.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Environment variables

These apply to the [rate limiting](server/limiter.js):

* `BLACKLIST=somedomain.com,...` – Blacklist sites by a match in the Referer.
* `ENABLE_IP_LIMITER=true` – Turn on rate limiting by IP address.
* `REDIS_URL=redis://...` – Database connection URL to use for persistence.

## See also

* https://github.com/jpillora/xdomain
* https://github.com/mapbox/corslite
* http://enable-cors.org
