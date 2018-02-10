var webpack = require('webpack');
var CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: __dirname + "/js/app.jsx",

  output: {
    path: __dirname + "/../priv/static/js",
    filename: "app.js"
  },

  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: "babel-loader",
      options: {
        babelrc: false,
        presets: ["es2015", "react"],
        plugins: [
          ['transform-class-properties', {spec: true}],
          ["transform-object-rest-spread"]
        ]
      }
    }]
  },

  resolve: {
    alias: {
      js: __dirname + "/js"
    },
    extensions: [ '.js', '.jsx', '.json' ],
    modules: [ "node_modules", "js" ],
  },

  plugins: [
    new webpack.DefinePlugin({ // <-- key to reducing React's size
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.DedupePlugin(), //dedupe similar code
    new webpack.optimize.UglifyJsPlugin(), //minify everything
    new webpack.optimize.AggressiveMergingPlugin(), //Merge chunks
    new webpack.optimize.AggressiveMergingPlugin(),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
};
