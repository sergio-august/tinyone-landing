const path = require("path")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const WebpackChunkHash = require("webpack-chunk-hash")
// const nodeExternals = require("webpack-node-externals") // for target: "node"

module.exports = {
    target: "web",
    // externals: [nodeExternals()],  // for target: "node"
    externals: {
        jquery: 'jQuery'
    },
    devServer: {
        // Parse host and port from env to allow customization.
        host: process.env.HOST || "localhost", // Defaults to `localhost`
        port: process.env.PORT || 8080, // Defaults to 8080
        // If you use Docker, Vagrant or Cloud9, set
        // host: options.host || "0.0.0.0"; // 0.0.0.0 is available to all network devices
        // open: true, // Open the page in browser
        overlay: true, // shows a full-screen overlay in the browser when there are compiler errors or warnings
        stats: "errors-only", // Display only errors to reduce the amount of output.
        contentBase: path.resolve(__dirname, "src"),
        inline: true, // script will be inserted in your bundle to take care of live reloading
        watchContentBase: true,
        // historyApiFallback: // for HTML5 History API based routing
    },
    entry: { main: "./src/scripts/main.js" },
    output: {
        path: path.resolve(__dirname, "dist/"),
        filename: "assets/scripts/[name].[chunkhash].js"
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|jpeg|svg|webp)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]?[hash:8]",
                            outputPath: "/assets/images/",
                            useRelativePath: true
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf)?$/,
                loader: "file-loader",
                options: {
                    name: "[name].[ext]",
                    outputPath: "/assets/fonts/"
                }
            },
            {
                test: /favicon\.ico$/,
                loader: "file-loader",
                options: { name: "[name].[ext]" }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.s?css$/,
                use: ["style-loader", MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin("dist", {}),
        new MiniCssExtractPlugin({
            filename: "assets/styles/main.[contenthash].css"
        }),
        new HtmlWebpackPlugin({
            // When passing true or 'body' all javascript resources will be placed at body bottom.
            // 'head' will place the scripts in the head element
            inject: false,
            hash: true,
            template: path.resolve(__dirname, "src/index.html"),
            filename: path.resolve(__dirname, "dist/index.html")
        }),
        new WebpackChunkHash()
    ]
}
