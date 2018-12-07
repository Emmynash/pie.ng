const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
import config from './client/config/config.client'

module.exports = {
  node: {
  	fs: 'empty'
	},
	entry: {
		payment:		[path.resolve(__dirname, 'client', 'apps', 'payment'), 'webpack-hot-middleware/client'],
		dashboard:	[path.resolve(__dirname, 'client', 'apps', 'dashboard'), 'webpack-hot-middleware/client'],
		// landing:		[path.resolve(__dirname, 'client', 'apps', 'landing'), 'webpack-hot-middleware/client'],
		// vendor:			['react', 'webpack-hot-middleware/client'],
	},
	output: {
		path: path.resolve(__dirname, 'client'),
		filename: '[name].bundle.js',
		publicPath: '/'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('development'),
				WEBPACK: true
			},
			config: JSON.stringify(config)
		}),
		new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        Popper: ['popper.js', 'default'],
        // In case you imported plugins individually, you must also require them here:
        Util: 'exports-loader?Util!bootstrap/js/dist/util',
        Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown',
		}),
	],
	module: {
		loaders: [
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
					query: {
						presets: [ 'react-hmre' ]
					}
				},
				include: path.resolve(__dirname, 'client'),
			},
			{
				test: /\.scss/,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader',
					{
						loader: 'postcss-loader',
						options: {
							plugins: function() {
                return [
                  autoprefixer
                ]
              }
						}
					}
				],
				include: path.resolve(__dirname, 'client')
			},
			{
				test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
		  },
		  { test: /\.css$/, loader: 'style-loader!css-loader' }
		]
	}
}
