const path = require('path');

module.exports = {
  lintOnSave: true,
  // productionTip: false,
  chainWebpack: config => config.resolve.symlinks(false),
  configureWebpack: {
    resolve: {
      extensions: ['*', '.mjs', '.js', '.vue', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
        // {
        //   test: /\.js$/,
        //   loader: require.resolve('@open-wc/webpack-import-meta-loader'),
        // },
        // {
        //   test: /\.wasm$/,
        //   type: 'javascript/auto',
        //   use: 'base64-loader',
        // },
      ],
    },
  },
  // devServer: {
  //   contentBase: path.join(
  //     __dirname,
  //     'node_modules/hack-hydra-dx-wasm/build/web'
  //   ),
  //   contentBasePublicPath: '/node_modules/hack-hydra-dx-wasm/build/web',
  // },
};
