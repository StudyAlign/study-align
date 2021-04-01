const path = require('path');

module.exports = {
    mode: 'development',
    target: 'es6',
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