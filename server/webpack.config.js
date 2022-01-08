const path = require('path')

module.exports = {
  entry: './src/worker.ts',
  output: {
    filename: 'worker.js',
    path: path.join(__dirname, 'dist'),
  },
  devtool: 'cheap-module-source-map',
  mode: 'development',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          // transpileOnly is useful to skip typescript checks occasionally:
          // transpileOnly: true,
        },
      },
      {
        test: /\.(css|html)$/,
        use: 'raw-loader',
      },
    ],
  },
  resolve: {
    fallback: {
      // https://github.com/webpack-contrib/css-loader/issues/447#issuecomment-285598881
      // https://webpack.js.org/migrate/5/
      fs: 'false',
    },
  },
}
