# Contributing

## Running tests

Install Node 0.10 and [PhantomJS](http://phantomjs.org/), then run:

```
npm install -g grunt-cli
npm install
grunt
```

## Code coverage

```bash
NODE_ENV=test mocha --reporter html-cov test/server_test.js > coverage.html
open coverage.html
```
