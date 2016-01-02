module.exports = function (config) {
    config.set({
        frameworks: ['jasmine'],
        files: [
            'src/**/*.js',
            'spec/**/*.js'
        ],
        plugins: [
            'karma-jasmine',
            'karma-chrome-launcher'
        ]
    });
};