const webpack = require('webpack');

module.exports = {
  entry: './server/worker.js',
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.(css|html)$/,
        use: 'raw-loader'
      }
    ]
  },
  node: {
    // https://github.com/webpack-contrib/css-loader/issues/447#issuecomment-285598881
    fs: 'empty'
  },
  // https://developers.cloudflare.com/workers/writing-workers/using-npm-modules/
  target: 'webworker',
  plugins: [
    new webpack.EnvironmentPlugin({
      WEBPACK: true
    })
  ]
};
