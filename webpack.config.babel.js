var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')


module.exports = {
	entry: ['./src/index.js'], 
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].bundle.js',
	},
	externals: {
		"p5": "p5"
	},
	module: {
		rules: [{
			test: /\.js/,
			exclude: /(node_modules|bower_components)/,
			use: [{
				loader: 'babel-loader'
			}]
		},
		{
			test: /\.css/,
			use: ['style-loader', 'css-loader'],
		},
		{
			test: /\.(png|jpe?g|gif|mid)$/i,
			loader: 'file-loader',
			options: {
				// 配置 name 屬性 (第二步)
				name: '[name].[ext]',
			}
		}]
	},
	plugins: [
		new webpack.optimize.OccurrenceOrderPlugin(),
		new HtmlWebpackPlugin({
		template: './index.html'
		})
	],
	optimization: {
		minimize: true
	}
}