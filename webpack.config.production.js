var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: './index',
  output:
    { path: __dirname
    , filename: 'bundle.js'
    , publicPath: '/'
  }
  , resolveLoader:
    { modulesDirectories: ['node_modules']
    }
  , resolve: {
    extensions: ['', '.js', '.coffee', '.cjsx']
  },
  module: {
    loaders:
    [ { test: /\.json$/, loader: 'json' }
    , { test: /\.js?$/
      , loader: 'babel-loader'
      , include: path.join(__dirname, './')
      }
    , { test: /\.cjsx$/, loaders: ['coffee', 'cjsx'] }
    , { test: /\.coffee$/, loader: 'coffee' }
    ]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ]
};
