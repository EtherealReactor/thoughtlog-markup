const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const parts = require('./webpack.parts.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AutoPrefixer = require('autoprefixer');
const glob = require('glob-all');
const PurifyCSSPlugin = require('purifycss-webpack');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
}

// const commonConfig = {
//   entry: {
//     app: PATHS.app,
//   },
//   output: {
//     path: PATHS.build,
//     filename: "[name].js",
//   },
//   plugins: [
//     new HtmlWebpackPlugin({
//       template: 'index.html'
//     }),
//     new webpack.WatchIgnorePlugin([
//       path.join(__dirname, "node_modules")
//     ]),
//   ],
// };

const commonConfig = merge([
  {
    entry: {
      app: PATHS.app,
    },
    output: {
      path: PATHS.build,
      filename: "[name].js",
    },
    resolve: {
      modules: [
        "node_modules",
        PATHS.app
      ],
      extensions: [".js", ".jsx", ".scss"]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'index.html'
      }),
      new webpack.WatchIgnorePlugin([
        path.join(__dirname, "node_modules")
      ]),
      new ExtractTextPlugin({
        allChunks: true,
        filename: "[name].css",
      }),
      new PurifyCSSPlugin({
        paths: glob.sync(path.join(__dirname, '*.html'))
      }),
    ],
  },
  parts.loadSCSS({ exclude: /node_modules/ }),
  parts.loadFonts(),
]);

const prodConfig = merge([]);

// const prodConfig = () => {
//   return commonConfig;
// };

// const devConfig = () => {
//   const config = {
//     devServer: {
//       contentBase: PATHS.build,
//       host: 'localhost' || process.env.host,
//       port: '8080' || process.env.PORT,
//       overlay: {
//         errors: true,
//         warnings: true,
//       },
//       watchOptions: {
//         aggregateTimeout: 300,
//         poll: 1000,
//       },
//     }
//   };
//   return Object.assign({}, commonConfig, config);
// }
  
const devConfig = merge([
  parts.devServer({
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || '8080'
  })
]);


// module.exports = (env) => {
// 
//   if (env === "production") {
//     return prodConfig();
//   }
// 
//   return devConfig();
// };

module.exports = (env) => {
  if (env === "production") {
    return merge(commonConfig, prodConfig);
  }
  return merge(commonConfig, devConfig);
};




