var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:3373',
    'webpack/hot/only-dev-server',
    './scripts/index'
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/scripts/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.coffee', '.cjsx']
  },
  module: {
    loaders:
    [ { test: /\.json$/, loader: 'json' }
    , { test: /\.jsx?$/
      , loaders: ['react-hot', 'babel']
      , include: path.join(__dirname, 'scripts')
      }
    , { test: /\.cjsx$/, loaders: ['react-hot', 'coffee', 'cjsx'] }
    , { test: /\.coffee$/, loader: 'coffee' }
    ]
  }
};
