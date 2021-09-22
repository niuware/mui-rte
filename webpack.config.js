const path = require('path');

module.exports = {
    name: "mui-rte-example",
    mode: "development",
    node: {
        __dirname: false,
        __filename: false
    },
    entry: {
        bundle: "./examples/main.tsx"
    },
    output: {
        filename: "bundle.js",
        path: path.join(__dirname, "examples")
    },

    devtool: "inline-source-map",

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            }
        ]
    },

    optimization: {
        minimize: (process.env.NODE_ENV === "production")
    },

    devServer: {
        hot: true,
        static: {
            directory: path.join(__dirname, "examples")
        },
        port: 9001,
        watchFiles: ["src/*"],
        compress: true,
        host: "0.0.0.0"
    }
};