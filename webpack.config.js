/* eslint-env node */
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
      url: require.resolve('url'),
    },
  },
  // https://developers.cloudflare.com/workers/writing-workers/using-npm-modules/
  target: 'webworker',
};
