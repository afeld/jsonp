module.exports = {
  entry: "./server/worker.js",
  // https://developers.cloudflare.com/workers/writing-workers/using-npm-modules/
  target: "webworker"
};
