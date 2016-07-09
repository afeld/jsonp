# JSONProxy [![Build Status](https://travis-ci.org/afeld/jsonp.png?branch=master)](https://travis-ci.org/afeld/jsonp)

Simple HTTP proxy that enables cross-domain requests to any JSON API. See https://jsonp.afeld.me for documentation. See the [releases](https://github.com/afeld/jsonp/releases) page for the [client library](jsonp.js) changelog.

## Setup

### Simple

See [`.travis.yml`](.travis.yml) for compatible Node versions.

```bash
npm install
npm start
```

and do requests to `http://localhost:8000/?url=...`. To enable [New Relic](https://newrelic.com/), ensure that the `NEW_RELIC_LICENSE_KEY` environment variable is set.

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

##### Docker Compose

1. Set up a `docker-machine`. https://jsonp.afeld.me uses [Digital Ocean](https://www.digitalocean.com/), set up with [these instructions](https://docs.docker.com/machine/get-started-cloud/#digital-ocean-example).

    ```bash
    docker-machine create --driver digitalocean --digitalocean-access-token <token> --engine-opt log-opt="max-size=50m" --engine-opt log-opt="max-file=100" <name>
    ```

1. Run:

    ```bash
    ./bin/deploy <name>
    ```

##### [Kubernetes](http://kubernetes.io/)

Initial deployment:

```bash
kubectl create -f kube.yml --record
kubectl expose deployment jsonp --type="LoadBalancer" --port=80 --target-port=8000

# re-run this until there's an EXTERNAL-IP, then visit that in your browser
kubectl get service jsonp
```

Updates:

```bash
kubectl replace -f kube.yml --record
```

## See also

* https://github.com/jpillora/xdomain
* https://github.com/mapbox/corslite
* http://enable-cors.org
