// https://developers.cloudflare.com/workers/writing-workers/

addEventListener("fetch", event => {
  event.respondWith(fetchAndApply(event.request));
});

async function fetchAndApply(request) {
  return new Response("hello world");
}
