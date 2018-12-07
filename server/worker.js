const handleRequest = require('./worker-helper');

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});
