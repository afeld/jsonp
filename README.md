# JSONProxy

Simple HTTP proxy that enables cross-domain requests to any JSON API.  See [jsonp.jit.su](http://jsonp.jit.su/) for documentation.

## Running Locally

```
npm install
node server.js
```

and do requests to `http://localhost:8000/?url=...`

## Contributing

To run tests, install Node 0.8 and [PhantomJS](http://phantomjs.org/) and run:

```
npm install
grunt
```
