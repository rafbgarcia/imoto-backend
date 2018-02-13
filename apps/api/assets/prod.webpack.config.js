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
    rules: [
      {
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
      },

      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        exclude: /node_modules/,
        loaders: [
          'file-loader?name=images/[name].[ext]',
          {
            loader: 'image-webpack-loader',
            options: {
              query: {
                mozjpeg: {
                  progressive: true,
                },
                gifsicle: {
                  interlaced: true,
                },
                optipng: {
                  optimizationLevel: 7,
                },
                pngquant: {
                  quality: '65-90',
                  speed: 4
                }
              }
            }
          }
        ]
      },

      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                sourceMap: true
              }
            },
            {
              loader: "postcss-loader",
              options: {
                minimize: true,
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ],
        })
      }
    ],
  },

  resolve: {
    alias: {
      "js": __dirname + "/js",
    },
    extensions: [".js", ".json", ".jsx", ".css", ".scss"],
    modules: [ "node_modules", "js", __dirname ],
  },

  plugins: [
    new CopyWebpackPlugin([{
      from: "./static",
      to: path.resolve(__dirname, "../priv/static"),
      ignore: [".DS_Store"],
    }]),
    new ExtractTextPlugin({
      filename: "css/app.css",
      allChunks: true
    }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        warnings: false, // Suppress uglification warnings
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true
      },
      output: {
        comments: false,
      },
      exclude: [/\.min\.js$/gi] // skip pre-minified libs
    }),
    new webpack.optimize.AggressiveMergingPlugin(), // Merge chunks
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
};
