const handleRequest = require('./worker-helper');

// https://gist.github.com/ithinkihaveacat/227bfe8aa81328c5d64ec48f4e4df8e5
interface FetchEvent extends Event {
  request: Request;
  respondWith(response: Promise<Response> | Response): Promise<Response>;
}

addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(handleRequest(event.request));
});
