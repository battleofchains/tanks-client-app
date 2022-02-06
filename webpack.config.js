const S3Plugin = require('webpack-s3-plugin');
const webpack = require('webpack');
const pkg = require('./package');
const staticPath = 'tanks.app';

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const config = {
	mode,
	devtool: 'inline-source-map',
	entry: './src/index.tsx',
	output: {
		path: __dirname + '/build',
		filename: 'bundle.js',
	},
	devServer: {
		static: './assets',
		port: 3000,
		//hot: false,
		//liveReload: false,
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
	module: {
		rules: [
			{ test: /\.tsx?$/, exclude: /node_modules/, loader: 'ts-loader' },
			{ test: /\.js$/, use: [], enforce: 'pre' },
			{ test: /\.css$/, use: ['style-loader', 'css-loader'] },
			{
				test: /\.(png|jpe?g|gif|webp|mp3|ogg)$/,
				loader: 'file-loader',
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource',
			}
		],
	},

	plugins: [
		new webpack.DefinePlugin({
			APP_VERSION: JSON.stringify(pkg.version),
			MODE: JSON.stringify(mode),
			APP_URL: JSON.stringify(
				process.env.APP_URL || 'https://test.battleofchains.com',
			),
			API_URL: JSON.stringify(
				process.env.API_URL || 'https://test.battleofchains.com/api',
			),
			STATIC_URL: JSON.stringify(
				process.env.STATIC_URL || 'https://static.ubex.com/tanks.app/assets',
			),
		}),
	],
};
if (process.env.DEPLOY) {
	config.output.publicPath = `https://static.ubex.com/${staticPath}/${pkg.version}/`;
	config.plugins.push(
		new S3Plugin({
			// Exclude uploading of html
			exclude: /.*\.html$/,
			// s3Options are required
			s3Options: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
				region: 'us-east-1',
			},
			s3UploadOptions: {
				Bucket: 'static.ubex',
			},
			basePath: `${staticPath}/${pkg.version}`,
			cloudfrontInvalidateOptions: {
				DistributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID,
				Items: [`/static.ubex/${staticPath}/${pkg.version}/*`],
			},
		}),
	);
}
module.exports = config;
