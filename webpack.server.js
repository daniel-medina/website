const path = require('path')
const webpackNodeExternals = require('webpack-node-externals')

module.exports = {
  mode: "development",
  devtool: "source-map",
  target: 'node',
  entry: './src/server.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/build'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: '/node_modules/',
        use: [
          {
            loader: "ts-loader"
          }
        ]
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      }
    ]
  },
  externals: [ webpackNodeExternals() ]
}
