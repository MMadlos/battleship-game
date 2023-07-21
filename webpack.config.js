const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const ruleForStyles = {
	test: /\.css$/i,
	use: ["style-loader", "css-loader"],
}

const ruleForImages = {
	test: /\.(png|svg|jpg|jpeg|gif)$/i,
	type: "asset/resource",
}

const rules = [ruleForStyles, ruleForImages]

module.exports = {
	entry: "./src/index.js",
	output: {
		filename: "main.js",
		path: path.resolve(__dirname, "dist"),
		clean: true,
	},
	plugins: [new HtmlWebpackPlugin({ template: "src/index.html" })],
	module: { rules },
	devServer: {
		static: "./dist",
		open: true,
	},
}
