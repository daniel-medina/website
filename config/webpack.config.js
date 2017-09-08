/** We get necessary node modules */
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

/** We compile the files instead of using dev server or hot reload */
const config = {
  entry: [
    './views/sass/main.js',
    './views/components/main.js'
  ],
  output: {
    path: path.resolve(__dirname, '../public/assets'),
    filename: 'content.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!sass-loader'
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('styles.css')
  ],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
  }
}

module.exports = config
