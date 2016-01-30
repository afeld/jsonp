# JSONProxy [![Build Status](https://travis-ci.org/afeld/jsonp.png?branch=master)](https://travis-ci.org/afeld/jsonp)

Simple HTTP proxy that enables cross-domain requests to any JSON API. See https://jsonp.afeld.me for documentation. See the [releases](https://github.com/afeld/jsonp/releases) page for the [client library](jsonp.js) changelog.

## Setup

### Simple

See [`.travis.yml`](.travis.yml) for compatible Node versions.

```bash
npm install
npm start
```

and do requests to `http://localhost:8000/?url=...`.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Docker

This is how JSONProxy is deployed to production, so running locally with this setup will be more realistic.

#### Development

1. If you don't have Docker set up already, follow their [Get Started](https://www.docker.com/) instructions.
1. Start a Docker Quickstart Terminal.
1. Run `touch .env`.
    * If you are adding a New Relic License Key, add as `NEW_RELIC_LICENSE_KEY=...` in that file.
1. Start the server with `docker-compose up`.
    * If you make a change and need to re-build, just press `CTRL-c` and run again.
1. Open in the browser by running `open http://$(docker-machine ip default)`.

#### Deployment

Assumes an existing Digital Ocean Droplet, with a `docker-machine` `name` of `do2`. Run:

```bash
./bin/deploy
```

More info:

* https://docs.docker.com/machine/get-started-cloud/
* https://docs.docker.com/machine/drivers/digital-ocean/

## See also

* https://github.com/jpillora/xdomain
* https://github.com/mapbox/corslite
* http://enable-cors.org
