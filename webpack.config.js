module.exports = {
  entry: './server/worker.js',
  mode: 'none',
  // https://developers.cloudflare.com/workers/writing-workers/using-npm-modules/
  target: 'webworker'
};
