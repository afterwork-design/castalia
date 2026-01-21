const {merge} = require("webpack-merge");
const webpackconfig = require("./webpack.config");

const IsDevelopment = process.env.NODE_ENV === "development";

module.exports = {
    pageExtensions: ["js", "jsx", "ts", "tsx"],
    assetPrefix: IsDevelopment ? "/" : "/castalia",
    webpack: (config, options) => merge(config, webpackconfig),
    reactStrictMode: true,
};
