# JSONProxy [![Build Status](https://travis-ci.org/afeld/jsonp.png?branch=master)](https://travis-ci.org/afeld/jsonp)

Simple HTTP proxy that enables cross-domain requests to any JSON API.  See https://jsonp.nodejitsu.com for documentation.  See the [releases](https://github.com/afeld/jsonp/releases) page for the [client library](jsonp.js) changelog.

## Running Locally

Requires Node 0.8 (not 0.10 – see [#18](https://github.com/afeld/jsonp/issues/18#issuecomment-54216994)).

```
npm install
node server.js
```

and do requests to `http://localhost:8000/?url=...`

## See Also

* https://github.com/jpillora/xdomain
* https://github.com/mapbox/corslite
* http://enable-cors.org
