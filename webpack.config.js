const webpack = require('webpack');

// https://community.cloudflare.com/t/cloudflare-workers-webpack-boilerplate-rfc/30404/13
const workerSizeLimit = 1000000;

module.exports = {
  entry: './server/worker.js',
  mode: 'production',
  node: {
    // https://github.com/webpack-contrib/css-loader/issues/447#issuecomment-285598881
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  performance: {
    maxAssetSize: workerSizeLimit,
    maxEntrypointSize: workerSizeLimit
  },
  plugins: [
    new webpack.ProvidePlugin({
      performance: 'performance-polyfill'
    })
  ],
  // https://developers.cloudflare.com/workers/writing-workers/using-npm-modules/
  target: 'webworker'
};
