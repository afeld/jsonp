# JSONProxy [![Build Status](https://travis-ci.org/afeld/jsonp.png?branch=master)](https://travis-ci.org/afeld/jsonp)

HTTP proxy that enables cross-domain requests to any JSON API. See https://jsonp.afeld.me for documentation. See the [releases](https://github.com/afeld/jsonp/releases) page for the [client library](client/jsonp.js) changelog.

## Development

Code is written in a combination of JavaScript and TypeScript. The app is written to be deployed to a [CloudFlare Worker](https://developers.cloudflare.com/workers/) using [Terraform](https://www.terraform.io/), but can be run locally by doing the following:

1. Install NodeJS >= 7.6.0.
1. Install the dependencies.

   ```sh
   npm install
   ```

1. Run the server.

   ```sh
   npm start
   ```

See [CONTRIBUTING](CONTRIBUTING.md) for more info.

## Deployment

1. Install NodeJS >= 7.6.0 and [Terraform](https://learn.hashicorp.com/terraform/getting-started/install.html).
1. Install the dependencies.

   ```sh
   npm install
   ```

1. Set up CloudFlare.

   1. [Sign up for CloudFlare](https://www.cloudflare.com/), and ensure you have a domain pointed there for DNS.
   1. [Get a CloudFlare API key.](https://api.cloudflare.com/)
   1. Go into the [`terraform/`](terraform) directory.

   ```sh
   cd terraform
   ```

   1. Create a `terraform/terraform.tfvars` file.

   ```hcl
   cloudflare_email = "..."
   cloudflare_token = "..."
   ```

1. [Create a Terraform Cloud account.](https://app.terraform.io/signup)
1. Set up Terraform.

   ```sh
   terraform init
   ```

1. Deploy the environment.

   ```sh
   cd ..
   npm run deploy
   ```

If you use [the client library](client/jsonp.js) with your own JSONP deployment, override the proxy URL before calling `$.jsonp()`.

```javascript
$.jsonp.PROXY = 'https://mydomain.com/proxy/path/';
```

## See also

- https://github.com/jpillora/xdomain
- https://github.com/mapbox/corslite
- http://enable-cors.org
