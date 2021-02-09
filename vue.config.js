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
      ],
    },
  },
};
