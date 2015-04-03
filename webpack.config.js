var webpack = require('webpack')


module.exports =
{ entry: './dist/index'
, output:
  { path: __dirname + '/dist'
  , filename: 'kronos.min.js'
  , publicPath: '/'
  }
, resolve:
  { extensions: ['', '.js']
  }
, module:
  { loaders:
    [ { test: /\.json$/
      , loader: 'json'
      }
    , { test: /\.jsx?$/
      , loader: 'babel'
      , exclude: /node_modules/
      }
    ]
  }
, plugins:
  [ new webpack.optimize.OccurenceOrderPlugin()
  , new webpack.DefinePlugin(
    { 'process.env':
      { 'NODE_ENV': JSON.stringify('production') }
    }
  )
  , new webpack.optimize.UglifyJsPlugin(
    { compressor:
      { warnings: false }
    }
  )
  ]
}
