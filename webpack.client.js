const path = require('path')

module.exports = {
  mode: "development",
  devtool: "source-map",
  target: 'node',
  entry: './src/client.tsx',
  output: {
    filename: 'js/website.js',
    path: path.resolve(__dirname, 'build/public'),
    publicPath: '/build/public'
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
  }
}
