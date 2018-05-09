const path = require('path');

const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const config = {
    dev: {
        variantPath: 'src/scripts/variants/development'
    },
    prod: {
        variantPath: 'src/scripts/variants/production'
    }
}[process.env.NODE_ENV];
const isProd = process.env.NODE_ENV === 'prod';

module.exports = {
    mode: isProd ? 'production' : 'development',
    entry: ['./src/scripts/main.ts'],
    output: {
        path: path.resolve(__dirname, 'public/'),
        filename: 'app.js',
    },
    cache: !isProd,
    resolve: {
        extensions: ['.ts', '.js'],
        modules: ['node_modules'],
        alias: {
            variantPath: path.resolve(__dirname, config.variantPath)
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ['ts-loader'],
                exclude: [/node_modules/, nodeModulesPath],
            },
            {
                test: /\.jsx?$/,
                use: ['babel-loader'],
                exclude: [/node_modules/, nodeModulesPath],
            },
        ]
    }
};
