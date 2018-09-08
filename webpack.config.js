module.exports = {
  entry: "./server/worker.js",
  mode: "none",
  node: {
    // https://github.com/webpack-contrib/css-loader/issues/447#issuecomment-285598881
    fs: "empty",
    net: "empty",
    tls: "empty"
  },
  // https://developers.cloudflare.com/workers/writing-workers/using-npm-modules/
  target: "webworker"
};
