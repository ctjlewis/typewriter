const ClosurePlugin = require('closure-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/core/typewriter.js',
    mode: 'production',
    optimization: {
        minimizer: [
            new ClosurePlugin({ 
                mode: 'AGGRESSIVE_BUNDLE',
                platform: 'native'
            }, {
                entry_point: path.resolve('./src/core/typewriter.js')
                // compiler flags here
                //
                // for debugging help, try these:
                //
                // formatting: 'PRETTY_PRINT'
                // debug: true,
                // renaming: false
            })
        ]
    }
};