const withPlugins = require("next-compose-plugins")
const {merge} = require("webpack-merge");
const webpackconfig = require("./webpack.config");


const IsDevelopment = process.env.NODE_ENV === "development";
const nextConfig = {
    pageExtensions: ["js", "jsx", "ts", "tsx"],
    assetPrefix: IsDevelopment ? "" : "/castalia",
};

module.exports = withPlugins([], {
    ...nextConfig,
    webpack: (config, options) => merge(config, webpackconfig)
});
