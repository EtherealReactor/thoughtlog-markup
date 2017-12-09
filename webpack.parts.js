const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

exports.devServer = ({ host = 'loalhost', port = '8080'} = {}) => ({
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    stats: "errors-only",
    host, // Defaults to `localhost`
    port, // Defaults to 8080
    overlay: {
      errors: true,
      warnings: true,
    },
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
    },
  },
});

exports.loadSCSS = ({include, exclude} = {}) => {

  return {
    module: {
      rules: [
        {
          test: /\.scss$/,
          include, 
          exclude,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              { loader: 'css-loader', options: { modules: true, importLoaders: 1, sourceMap: true } },
              { loader: 'postcss-loader', options: { plugins: [ require('autoprefixer') ], sourceMap: 'inline' }},
              { loader: 'sass-loader', options: { sourceMap: true }}
            ]
            // use: ['css-loader', 'postcss-loader', 'sass-loader']
          }),
        },
      ],
    }
  }
};

exports.loadFonts = () => {
  return {
    module: {
      rules: [
        {
          test: /\.(ttf|eot|woff|woff2)$/,
          loader: "file-loader",
          options: {
            name: "fonts/[name].[ext]",
          },
        },
      ],
    }
  }
};