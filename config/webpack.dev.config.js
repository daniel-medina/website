const webpack = require('webpack')
const Dashboard = require('webpack-dashboard/plugin')

/** We use webpack to compile Vue files into a distribuable js file */
const config = {
  entry: [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    /** This will load Vue.js components */
    './views/components/main.js',
    /** And this will load sass files */
    './views/sass/main.js'
  ],
  output: {
    path: '/assets/',
    publicPath: 'http://localhost:3000/assets',
    filename: 'content.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.scss$/,
        use: [{
          loader: 'style-loader'
        },
        {
          loader: 'css-loader'
        },
        {
          loader: 'sass-loader'
        }]
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
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new Dashboard()
  ]
}

module.exports = config
