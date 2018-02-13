const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: ["js/app.jsx", "css/app.scss"],

  output: {
    path: path.resolve(__dirname, "../priv/static"),
    filename: "js/app.js"
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
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
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
  ],
};
