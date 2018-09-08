addEventListener("fetch", event => {
  event.respondWith(fetchAndApply(event.request));
});

async function fetchAndApply(req) {
  const data = await fetch("http://worldclockapi.com/api/json/est/now").then(
    response => {
      return response.json();
    }
  );
  return new Response(data.currentFileTime);
}
