const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: {
    home: './src/containers/index.js',
    product: './src/containers/product.js',
    cart: './src/containers/cart.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'static/[name].js',
    // publicPath: "/",
    assetModuleFilename: 'static/assets/[hash][ext]'
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader:'html-loader'
          }
        ]
      },
      {
        test: /\.(s*)css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        type: "asset/resource"
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./public/index.html",
      filename: "index.html",
      chunks: ['home']
    }),
    new HtmlWebPackPlugin({
      template: "./public/product.html",
      filename: "product.html",
      chunks: ['product']
    }),
    new HtmlWebPackPlugin({
      template: "./public/cart.html",
      filename: "cart.html",
      chunks: ['cart']
    }),
    new MiniCssExtractPlugin({
      filename: "static/[name].css"
    })
  ],
  devServer: {
    compress: true,
    contentBase: path.join(__dirname, "dist"),
    port: 9000,
    publicPath: "/",
    proxy: {
      '/api': 'http://localhost:3000',
    },
  }
}