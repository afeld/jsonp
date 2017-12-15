# JSONProxy [![Build Status](https://travis-ci.org/afeld/jsonp.png?branch=master)](https://travis-ci.org/afeld/jsonp)

Simple HTTP proxy that enables cross-domain requests to any JSON API. See https://jsonp.afeld.me for documentation. See the [releases](https://github.com/afeld/jsonp/releases) page for the [client library](jsonp.js) changelog.

## Setup

### Simple

See [`package.json`](package.json) for compatible Node versions.

```bash
npm install
npm start
```

and do requests to `http://localhost:8000/?url=...`. For live reloading:

```sh
npm install -g nodemon
export $(cat .env | xargs) && nodemon
```

### External services

The following service integrations can be enabled with the corresponding environment variables:

* [New Relic](https://newrelic.com/): set `NEW_RELIC_LICENSE_KEY`
* [Keen.io](https://keen.io/): set `KEEN_PROJECT_ID` and `KEEN_WRITE_KEY`

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Deployment

This app is deployed to AWS with the [Serverless Framework](https://serverless.com/framework/docs/). To deploy, run

```sh
sls deploy
```

## See also

* https://github.com/jpillora/xdomain
* https://github.com/mapbox/corslite
* http://enable-cors.org
