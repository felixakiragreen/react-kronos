var webpack = require('webpack')


module.exports =
{ entry: './src/index'
, output:
  { path: __dirname + '/dist'
  , filename: 'kronos.min.js'
  , publicPath: '/'
  }
, resolve:
  { extensions: ['', '.js', '.coffee', '.cjsx']
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
    , { test: /\.cjsx$/
      , loaders: ['coffee', 'cjsx']
      }
    , { test: /\.coffee$/
      , loader: 'coffee'
      }
    ]
  }
, plugins:
  [ new webpack.NormalModuleReplacementPlugin(/^kronos$/, '../src/index')
  , new webpack.optimize.OccurenceOrderPlugin()
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
