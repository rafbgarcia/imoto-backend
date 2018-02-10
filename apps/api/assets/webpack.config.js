module.exports = {
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
      "js": __dirname + "/js",
      "react": "preact-compat",
      "react-dom": "preact-compat",
    },
    extensions: [ '.js', '.jsx', '.json' ],
    modules: [ "node_modules", "js" ],
  },

  plugins: [
  ],
};
