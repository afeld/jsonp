import handleRequest from './worker-helper';

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});
