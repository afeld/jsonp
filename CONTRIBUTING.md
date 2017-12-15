# Contributing

## Running tests

Install Node and [PhantomJS](http://phantomjs.org/), then run:

```
npm install -g grunt-cli
npm install
npm test
```

The tests can be found under the [`test/`](https://github.com/afeld/jsonp/tree/master/test) directory.

## Code coverage

```bash
NODE_ENV=test mocha --reporter html-cov test/server_test.js > coverage.html
open coverage.html
```
