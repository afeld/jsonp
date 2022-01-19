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
        test: /\.(css|html|svg)$/,
        type: 'asset/source',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      // https://github.com/webpack-contrib/css-loader/issues/447#issuecomment-285598881
      fs: false,
      path: false,

      url: require.resolve('url'),
    },
  },
  // https://developers.cloudflare.com/workers/writing-workers/using-npm-modules/
  target: 'webworker',
  plugins: [
    new webpack.EnvironmentPlugin({
      WEBPACK: true,
    }),
  ],
};
