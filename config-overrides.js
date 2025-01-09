const webpack = require("webpack");
const path = require('path');

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  const alias = {
    koffi: false,
    "@src": path.resolve(__dirname, 'src/'),
  }
  config.resolve.fallback = {
    ...fallback,
    canvas: require.resolve('canvas-browserify'),
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    constants: require.resolve('constants-browserify'),
    os: require.resolve('os-browserify/browser'),
    vm: require.resolve('vm-browserify'),
    path: require.resolve('path-browserify'),
    zlib: require.resolve('browserify-zlib'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    assert: require.resolve('assert/'),
    'process/browser': require.resolve('process/browser'),
    child_process: false,
    net: false,
    tls: false,
    fs: false,
    readline: false,
    worker_threads: false,
    bufferutil: false,
    'utf-8-validate': false
  };
  config.resolve.alias = alias;

  config.plugins = config.plugins.filter(plugin => 
    !(plugin instanceof webpack.DefinePlugin)
  );

  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    }),
    new webpack.DefinePlugin({
      'process.env': {
        ...Object.keys(process.env).reduce((env, key) => {
          env[key] = JSON.stringify(process.env[key]);
          return env;
        }, {}),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
  );

  config.module.rules.push({
    test: /\.js$/,
    enforce: 'pre',
    use: ['source-map-loader'],
    exclude: /node_modules/
  });

  config.ignoreWarnings = [
    /Failed to parse source map/,
    /Critical dependency/
  ];

  config.module.rules.push({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false
    }
  });

  return config;
};