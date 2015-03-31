var webpack = require('webpack')


module.exports =
{ devtool: 'source-map'
, entry: './index'
, output:
  { path: __dirname
  , filename: 'bundle.js'
  , publicPath: '/'
}
, resolveLoader:
  { modulesDirectories: [ 'node_modules' ]
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
    , include: __dirname
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
