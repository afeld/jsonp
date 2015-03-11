# JSONProxy [![Build Status](https://travis-ci.org/ft-interactive/jsonp.png?branch=master)](https://travis-ci.org/ft-interactive/jsonp)

Simple HTTP proxy that enables cross-domain requests to any JSON API.  See https://jsonp.herokuapp.com for documentation.  See the [releases](https://github.com/ft-interactive/jsonp/releases) page for the [client library](jsonp.js) changelog.

## Running on Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Running Locally

```
npm install
npm start
```

and do requests to `http://localhost:8000/?url=...`

## Thanks

* [afled](https://github.com/afeld/jsonp) did the work. This fork is hosting on Heroku (instead of Nodjitsu).

## See Also

* https://github.com/jpillora/xdomain
* https://github.com/mapbox/corslite
* http://enable-cors.org
