/* eslint-env node */
const webpack = require('webpack');

module.exports = {
  entry: './server/worker.ts',
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            onlyCompileBundledFiles: true,
          },
        },
      },
      {
        test: /\.(css|html)$/,
        use: 'raw-loader',
      },
    ],
  },
  node: {
    // https://github.com/webpack-contrib/css-loader/issues/447#issuecomment-285598881
    fs: 'empty',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  // https://developers.cloudflare.com/workers/writing-workers/using-npm-modules/
  target: 'webworker',
  plugins: [
    new webpack.EnvironmentPlugin({
      WEBPACK: true,
    }),
  ],
};
