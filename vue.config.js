module.exports = {
  lintOnSave: true,
  chainWebpack: config => config.resolve.symlinks(false),
  // productionTip: false,
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
