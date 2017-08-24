const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  reactHotLoader: true,
  debug: false,
  hasServer: false,
  modifyWebpackConfig: (config, options) => {
    if (options.type === 'client') {
      config.plugins.push(
        new HtmlWebpackPlugin({
          template: 'src/index.ejs',
          // Sort the chunks so that the scripts are added in the correct order.
          chunksSortMode: (chunk1, chunk2) => {
            const orders = ['manifest', 'vendor', 'main'];
            const order1 = orders.indexOf(chunk1.names[0]);
            const order2 = orders.indexOf(chunk2.names[0]);
            return order1 - order2;
          }
        })
      );
    }

    config.resolve.alias = {
      fonts: require('path').resolve(process.cwd(), './src/fonts'),
      images: require('path').resolve(process.cwd(), './src/images'),
      components: require('path').resolve(process.cwd(), './src/components'),
      containers: require('path').resolve(process.cwd(), './src/containers'),
      screens: require('path').resolve(process.cwd(), './src/screens'),
      layouts: require('path').resolve(process.cwd(), './src/layouts'),
      state: require('path').resolve(process.cwd(), './src/state'),
      helpers: require('path').resolve(process.cwd(), './src/helpers'),
      selectors: require('path').resolve(process.cwd(), './src/selectors'),
      hoc: require('path').resolve(process.cwd(), './src/hoc'),
      routes: require('path').resolve(process.cwd(), './src/routes')
    };

    config.module.rules.find(
      loader => loader.loader === 'babel-loader'
    ).options.plugins = [
      'babel-plugin-transform-class-properties',
      'babel-plugin-transform-object-rest-spread',
      'babel-plugin-transform-decorators-legacy'
    ];

    return config;
  }
};
