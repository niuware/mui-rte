const path = require('path');
const { compilerOptions } = require('../tsconfig.json');

function transformsTsPaths(compilerOptions) {
  const { paths: pathsObject, baseUrl } = compilerOptions;
  const resultObject = {};

  function stripValue(value) {
    return value.replace('/*', '');
  }

  for (const key in pathsObject) {
    if (pathsObject.hasOwnProperty(key)) {
      const value = pathsObject[key][0];
      resultObject[stripValue(key)] = path.resolve(__dirname, `.${baseUrl}/${stripValue(value)}`);
    }
  }

  return resultObject;
}

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: async (config, { configType }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      ...transformsTsPaths(compilerOptions),
    };
    return config;
  },
};
