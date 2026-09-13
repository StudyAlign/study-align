const path = require('path');

module.exports = {
    mode: 'development',
    // ['web', 'es2015'] instead of bare 'es6': the platform ('web') lets newer
    // webpack (5.110+) pick a UMD chunk format; 'es2015' keeps the ES6 output.
    target: ['web', 'es2015'],
    devtool: 'inline-source-map',
    entry: './src/study-align-lib.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'study-align-lib-bundle.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd',
        library: 'studyAlignLib',
        libraryExport: 'default',
        umdNamedDefine: true,
    }
};