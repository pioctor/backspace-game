const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
module.exports = {
  entry: {
    bundle: "./src/app.ts"
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js"
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  devServer: {
    contentBase: path.join(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader"
      }
    ]
  },
  plugins: [
    new CopyPlugin([
      { context: "./src/", from: "**/*.html", to: ".", force: true },
      { context: "./src/", from: "**/*.css", to: ".", force: true }
    ])
  ]
};
