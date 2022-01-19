module.exports = function (config) {
  config.set({
    frameworks: ['mocha'],
    files: ['**/*.js', '**/*.ts'],
    exclude: ['node_modules'],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://www.npmjs.com/search?q=keywords:karma-preprocessor
    // preprocessors: {},

    // start these browsers
    // available browser launchers: https://www.npmjs.com/search?q=keywords:karma-launcher
    browsers: ['Chrome'], //, 'ChromeHeadless'],
  });
};
