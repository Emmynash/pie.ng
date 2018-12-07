const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const extractCSS = new ExtractTextPlugin('[name].bundle.css')
import config from './client/config/config.client'

/*config = Object.assign(config, {
	appUrl: 'https://test.pie.ng',
	apiUrl: 'https://test.pie.ng',
})*/

module.exports = {
  node: {
  	fs: 'empty'
	},
	entry: {
		payment:	[path.resolve(__dirname, 'client', 'apps', 'payment')],
		dashboard:	[path.resolve(__dirname, 'client', 'apps', 'dashboard')],
		// landing:	[path.resolve(__dirname, 'client', 'apps', 'landing')],
	},
	output: {
		path: path.resolve(__dirname, 'dist/client'),
		filename: '[name].bundle.js',
		publicPath: '/'
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"',
				// WEBPACK: false
			},
			config: JSON.stringify(config)
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: { warnings: false }
		}),
		new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default'],
      // In case you imported plugins individually, you must also require them here:
      Util: "exports-loader?Util!bootstrap/js/dist/util",
      Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
		}),
		extractCSS,
		new OptimizeCssAssetsPlugin({
	    cssProcessor: require('cssnano'),
	    cssProcessorOptions: { discardComments: { removeAll: true } }
	  }),
	],
	module: {
		loaders: [{ 
			test: /\.js$/,
			use: {
				query: {
					presets: [ 'react', 'es2015', 'stage-0' ]
	      },
				loader: 'babel-loader'
			},
			include: path.resolve(__dirname, 'client')
		}, {
			test: /\.s?css$/,
			use: extractCSS.extract({
				fallback: 'style-loader',
				use: [ 'css-loader', 'sass-loader', {
					loader: 'postcss-loader', options: {
						plugins: function() {
							return [
								autoprefixer
							]
            }
					}
				}],
			}),
		}, {
      test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
      loaders: 'file-loader'
    }, {
      test: /\.(png|jpg|gif)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }]
	  }]
	}
}