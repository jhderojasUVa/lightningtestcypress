/* eslint-env node */

// Configuration of webpack for Cypress in order to run
// new features on the browser
const glob = require('glob');
const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');

// TODO: Refactor this to something more cleaner (until filesToCopy constant!, becuase this smells)
// This will add the files of the component in an automatic way to a dist directory
// If you need to add more kind of files, see below
// Take the base files
const baseFiles = [
  ...glob.sync('./packages/**/*.jpg'),
  ...glob.sync('./packages/**/*.png')
];

// Add the index that must be injected
// TODO: put in the baseFiles array or not?
baseFiles.push('cypress/fixtures/index.html');

// Create the structure
const createCopyObject = (arrayOfFiles) => {
  return arrayOfFiles.map((element) => {
    return {
      from: element,
      to: 'static'
    }
  });
};

// Create the files
const filesToCopy = createCopyObject(baseFiles);

module.exports = {
  entry: glob.sync('./packages/**/*.js'),
  module: {},
  resolve: {
    extensions: ['.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'static'),
  },
  plugins: [
    new CopyPlugin(filesToCopy)
  ],
  devServer: {
    contentBase: path.join(__dirname, 'static'),
    allowedHosts: ['*']
  }
};
