module.exports = {
  lintOnSave: true,
  chainWebpack: config => config.resolve.symlinks(false),
  // productionTip: false,
  configureWebpack: {
    resolve: {
      extensions: ['*', '.mjs', '.js', '.vue', '.json', '.wasm'],
    },
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
        {
          test: /\.wasm$/,
          type: 'javascript/auto',
          use: 'base64-loader',
        },
      ],
    },
  },
};
