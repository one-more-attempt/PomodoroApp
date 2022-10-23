const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['./index.js'],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'builded')
    },
    plugins: [
        new HTMLWebpackPlugin({
            filename: 'index.html',
            template: './index.html'
        }),
        new HTMLWebpackPlugin({
            filename: 'main-page.html',
            template: 'src/components/main-page/main-page.html'
        }),
        new HTMLWebpackPlugin({
            filename: 'sign-in.html',
            template: 'src/components/sign-in/sign-in.html'
        }),
        new HTMLWebpackPlugin({
            filename: 'sign-up.html',
            template: 'src/components/sign-up/sign-up.html'
        }),
        new HTMLWebpackPlugin({
            filename: 'progress.html',
            template: 'src/components/progress/progress.html'
        }),
        
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            sources: true
                        }
                    }
                ]
            },
        ]
    },
    devServer: {
        static: {
            directory: path.join(__dirname, './')
        },
        compress: true,
        port: 4200
    }
};
