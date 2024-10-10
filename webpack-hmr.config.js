// eslint-disable-next-line @typescript-eslint/no-require-imports
const nodeExternals = require('webpack-node-externals');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = function (options, webpack) {
  return {
    ...options,
    entry: [
      'webpack/hot/poll?100',
      ...(Array.isArray(options.entry) ? options.entry : [options.entry]),
    ],
    externals: [
      nodeExternals({
        allowlist: ['webpack/hot/poll?100'],
      }),
    ],
    plugins: [
      ...options.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.WatchIgnorePlugin({
        paths: [/\.js$/, /\.d\.ts$/],
      }),
      new RunScriptWebpackPlugin({
        name: options.output.filename,
        autoRestart: false,
      }),
      new ForkTsCheckerWebpackPlugin({
        async: true,
        typescript: {
          configFile: 'tsconfig.build.json',
          mode: 'write-references',
        },
      }),
    ],
  };
};
