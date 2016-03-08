module.exports = {
    entry: [
        "./public/app.js"
    ],
    output: {
        path: __dirname + "/public",
        publicPath: "/",
        filename: "bundle.js"
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            query: {
                presets: ["es2015", "react"]
            }
        }, {
            test: /\.scss$/,
            loader: "style!css!sass"
        }],
        resolve: {
            extensions: ["", ".js", ".jsx", ".json"]
        },
        devServer: {
            historyApiFallback: true,
            contentBase: "./"
        }
    },
    devtool: 'sourcemap'
}
