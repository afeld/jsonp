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

* [Keen.io](https://keen.io/): set `KEEN_PROJECT_ID` and `KEEN_WRITE_KEY`

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Docker

1. Ensure Docker is installed and running.
1. Run `touch .env`
    * Optionally fill out with environment variables specified above.
1. Start the server with `docker-compose up`.
    * If you make a change and need to re-build, just press `CTRL-c` and run again.
1. Visit http://localhost.

## Deployment

This app is deployed to AWS with the [Serverless Framework](https://serverless.com/framework/docs/). To deploy, run

```sh
sls create_domain
sls deploy
```

If you use [the client library](jsonp.js) with your own JSONP deployment, override the proxy URL before calling `$.jsonp()`.

```javascript
$.jsonp.PROXY = 'https://mydomain.com/proxy/path/';
```

### Rate limiting

Do the following to set up an nginx proxy for rate limiting the requests.

1. [Get a CloudFlare API key.](https://api.cloudflare.com/)
1. Go into the [`terraform/`](terraform) directory.

    ```sh
    cd terraform
    ```

1. Create a `terraform.tfvars` file.

    ```hcl
    cloudflare_email = "..."
    cloudflare_token = "..."
    ```

1. Deploy the environment.

    ```sh
    terraform init
    terraform apply
    ```

## See also

* https://github.com/jpillora/xdomain
* https://github.com/mapbox/corslite
* http://enable-cors.org
