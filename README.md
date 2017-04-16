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

The following service integrations can be enabled with the corresponding envrionment variables:

* [New Relic](https://newrelic.com/): set `NEW_RELIC_LICENSE_KEY`
* [Keen.io](https://keen.io/): set `KEEN_PROJECT_ID` and `KEEN_WRITE_KEY`

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Docker

This is how JSONProxy is deployed to production, so running locally with this setup will be more realistic.

#### Development

1. If you don't have Docker set up already, follow their [Get Started](https://www.docker.com/) instructions.
1. Start a Docker Quickstart Terminal.
1. Run `touch .env`
    * Optionally fill out with environment variables specified above.
1. Start the server with `docker-compose up`.
    * If you make a change and need to re-build, just press `CTRL-c` and run again.
1. Open in the browser by running `open http://$(docker-machine ip default)`.

#### Deployment

This app is deployed to [Hyper.sh](https://hyper.sh/). To deploy, run

```sh
./bin/deploy
```

## See also

* https://github.com/jpillora/xdomain
* https://github.com/mapbox/corslite
* http://enable-cors.org
