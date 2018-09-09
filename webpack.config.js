const webpack = require('webpack');

module.exports = {
  entry: './server/worker.js',
  mode: 'none',
  node: {
    // https://github.com/webpack-contrib/css-loader/issues/447#issuecomment-285598881
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  plugins: [
    new webpack.ProvidePlugin({
      performance: 'performance-polyfill'
    })
  ],
  // https://developers.cloudflare.com/workers/writing-workers/using-npm-modules/
  target: 'webworker'
};
