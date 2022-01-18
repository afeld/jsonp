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
        test: /\.(css|html)$/,
        use: 'raw-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  // https://developers.cloudflare.com/workers/writing-workers/using-npm-modules/
  target: 'webworker',
};
